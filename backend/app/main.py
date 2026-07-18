import os
import logging
import joblib
import numpy as np
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
from scipy.optimize import minimize
from typing import Dict, Any

# ==========================================
# LOGGING CONFIGURATION
# ==========================================
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("SalesIntelligenceAPI")

app = Flask(__name__)
# Load Allowed Origins from environment variables (CORS hardening)
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",")
CORS(app, origins=allowed_origins)
logger.info(f"CORS initialized. Allowed origins: {allowed_origins}")

# Configuration Paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(BASE_DIR, "data", "Advertising.csv")
MODEL_DIR = os.path.join(BASE_DIR, "models")
MODEL_PATH = os.path.join(MODEL_DIR, "sales_model.joblib")
METRICS_PATH = os.path.join(MODEL_DIR, "model_metrics.joblib")
XAI_PATH = os.path.join(MODEL_DIR, "xai_results.joblib")

# Global variables for models
model_pipeline = None
model_metrics = None
xai_results = None

def load_ml_assets():
    """Attempts to load serialized machine learning pipeline and metrics."""
    global model_pipeline, model_metrics, xai_results
    logger.info("Loading machine learning assets from disk...")
    try:
        if os.path.exists(MODEL_PATH):
            model_pipeline = joblib.load(MODEL_PATH)
            logger.info("Successfully loaded ML model pipeline.")
        else:
            logger.warning(f"Model file not found at: {MODEL_PATH}")
            
        if os.path.exists(METRICS_PATH):
            model_metrics = joblib.load(METRICS_PATH)
            logger.info("Successfully loaded model training metrics.")
        else:
            logger.warning(f"Metrics file not found at: {METRICS_PATH}")
            
        if os.path.exists(XAI_PATH):
            xai_results = joblib.load(XAI_PATH)
            logger.info("Successfully loaded Explainable AI statistics.")
        else:
            logger.warning(f"XAI results file not found at: {XAI_PATH}")
    except Exception as e:
        logger.error(f"Failed to load machine learning assets: {str(e)}")

# Initialize assets on startup
load_ml_assets()

# ==========================================
# INFERENCE HELPERS
# ==========================================

def run_pipeline_prediction(tv: float, radio: float, newspaper: float) -> float:
    """Helper to structure features and run prediction through the pipeline."""
    if model_pipeline is None:
        raise ValueError("Model is not loaded on server.")
        
    # Preprocess newspaper using log1p matching training pipeline
    newspaper_log = np.log1p(newspaper)
    
    # Re-create engineered features
    total_spend = tv + radio + newspaper
    tv_share = tv / (total_spend + 1e-5)
    radio_share = radio / (total_spend + 1e-5)
    newspaper_share = newspaper / (total_spend + 1e-5)
    tv_radio_interaction = tv * radio
    
    df_feats = pd.DataFrame([{
        "TV": tv,
        "Radio": radio,
        "Newspaper": newspaper_log,
        "Total_Spend": total_spend,
        "TV_Share": tv_share,
        "Radio_Share": radio_share,
        "Newspaper_Share": newspaper_share,
        "TV_Radio_Interaction": tv_radio_interaction
    }])
    
    pred = model_pipeline.predict(df_feats)[0]
    return float(pred)

# ==========================================
# ERROR HANDLERS
# ==========================================

@app.errorhandler(400)
def bad_request(error):
    return jsonify({"error": "Bad Request", "message": str(error.description)}), 400

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Not Found", "message": "The requested resource could not be found."}), 404

@app.errorhandler(500)
def server_error(error):
    return jsonify({"error": "Internal Server Error", "message": "An unexpected error occurred."}), 500

# ==========================================
# API ENDPOINTS
# ==========================================

@app.route("/predict", methods=["POST"])
def predict():
    """Predict Sales based on marketing spend inputs."""
    if model_pipeline is None:
        logger.error("Predict endpoint called but model is missing.")
        return jsonify({"error": "Model not available", "message": "ML model is not loaded on server."}), 503
        
    data = request.get_json(silent=True)
    if data is None:
        return jsonify({"error": "Validation Error", "message": "Request body must be a valid JSON."}), 400
        
    # Validation
    errors = {}
    for field in ["tv", "radio", "newspaper"]:
        if field not in data:
            errors[field] = "Field is required."
        else:
            try:
                val = float(data[field])
                if val < 0.0:
                    errors[field] = "Value must be greater than or equal to 0.0."
                data[field] = val
            except (ValueError, TypeError):
                errors[field] = "Value must be a valid numeric number."
                
    if errors:
        logger.warning(f"Validation failed for /predict: {errors}")
        return jsonify({"error": "Validation Error", "details": errors}), 400
        
    try:
        tv, radio, newspaper = data["tv"], data["radio"], data["newspaper"]
        pred_sales = run_pipeline_prediction(tv, radio, newspaper)
        
        # Financial metrics: 1 unit sold = $100 in revenue. Sales is in thousands of units.
        revenue = pred_sales * 100.0  # in thousands of dollars
        total_spend = tv + radio + newspaper
        
        # ROI = (Revenue - Cost) / Cost
        roi = ((revenue - total_spend) / total_spend * 100.0) if total_spend > 0 else 0.0
        
        # 95% Confidence interval
        rmse = model_metrics.get("RMSE", 0.61) if model_metrics else 0.61
        confidence_lower = max(0.0, pred_sales - 1.96 * rmse)
        confidence_upper = pred_sales + 1.96 * rmse
        
        logger.info(f"Prediction success. Inputs: TV={tv}, Radio={radio}, Newspaper={newspaper} | Predicted Sales={pred_sales:.4f}")
        return jsonify({
            "predicted_sales": round(pred_sales, 4),
            "revenue": round(revenue, 2),
            "roi": round(roi, 2),
            "confidence_lower": round(confidence_lower, 4),
            "confidence_upper": round(confidence_upper, 4)
        })
    except Exception as e:
        logger.error(f"Inference error in /predict: {str(e)}")
        return jsonify({"error": "Inference Error", "message": str(e)}), 500

@app.route("/optimize", methods=["POST"])
def optimize():
    """Optimize budget allocation across TV, Radio, and Newspaper."""
    if model_pipeline is None:
        return jsonify({"error": "Model not available", "message": "ML model is not loaded on server."}), 503
        
    data = request.get_json(silent=True)
    if data is None:
        return jsonify({"error": "Validation Error", "message": "Request body must be a valid JSON."}), 400
        
    if "total_budget" not in data:
        return jsonify({"error": "Validation Error", "details": {"total_budget": "Field is required."}}), 400
        
    try:
        total_budget = float(data["total_budget"])
        if total_budget < 1.0 or total_budget > 450.0:
            return jsonify({"error": "Validation Error", "details": {"total_budget": "Total budget must be between $1k and $450k."}}), 400
    except (ValueError, TypeError):
         return jsonify({"error": "Validation Error", "details": {"total_budget": "Total budget must be a valid numeric number."}}), 400
         
    try:
        # Optimization via SLSQP
        def objective(spends):
            tv, radio, newspaper = spends
            pred = run_pipeline_prediction(tv, radio, newspaper)
            return -pred
            
        constraints = ({
            'type': 'ineq',
            'fun': lambda spends: total_budget - sum(spends)
        })
        
        bounds = [
            (0.0, 300.0), # TV historical bounds
            (0.0, 50.0),  # Radio bounds
            (0.0, 114.0)  # Newspaper bounds
        ]
        
        # Initial guess waterfall approximation
        init_radio = min(total_budget * 0.3, 45.0)
        init_tv = min(total_budget - init_radio, 200.0)
        init_newspaper = max(0.0, total_budget - init_radio - init_tv)
        init_sum = init_radio + init_tv + init_newspaper
        if init_sum > total_budget:
            init_newspaper = 0.0
            init_tv = total_budget - init_radio
            
        initial_guess = [init_tv, init_radio, init_newspaper]
        
        res = minimize(
            objective,
            initial_guess,
            method='SLSQP',
            bounds=bounds,
            constraints=constraints,
            options={'ftol': 1e-6}
        )
        
        opt_tv, opt_radio, opt_newspaper = res.x
        opt_tv = max(0.0, opt_tv)
        opt_radio = max(0.0, opt_radio)
        opt_newspaper = max(0.0, opt_newspaper)
        
        opt_sales = run_pipeline_prediction(opt_tv, opt_radio, opt_newspaper)
        revenue = opt_sales * 100.0
        actual_spend = opt_tv + opt_radio + opt_newspaper
        
        roi = ((revenue - actual_spend) / actual_spend * 100.0) if actual_spend > 0 else 0.0
        
        tv_pct = (opt_tv / actual_spend * 100.0) if actual_spend > 0 else 0.0
        radio_pct = (opt_radio / actual_spend * 100.0) if actual_spend > 0 else 0.0
        newspaper_pct = (opt_newspaper / actual_spend * 100.0) if actual_spend > 0 else 0.0
        
        logger.info(f"Optimization success. Budget: {total_budget} | Allocated: TV={opt_tv:.2f}, Radio={opt_radio:.2f}, Newspaper={opt_newspaper:.2f}")
        return jsonify({
            "tv_spend": round(opt_tv, 2),
            "radio_spend": round(opt_radio, 2),
            "newspaper_spend": round(opt_newspaper, 2),
            "predicted_sales": round(opt_sales, 4),
            "revenue": round(revenue, 2),
            "roi": round(roi, 2),
            "recommended_allocation": {
                "TV": round(tv_pct, 2),
                "Radio": round(radio_pct, 2),
                "Newspaper": round(newspaper_pct, 2)
            }
        })
    except Exception as e:
        logger.error(f"Optimization error in /optimize: {str(e)}")
        return jsonify({"error": "Optimization Error", "message": str(e)}), 500

@app.route("/train", methods=["POST"])
def train():
    """Trigger model training pipeline asynchronously/synchronously and reload assets."""
    logger.info("Training trigger received. Starting pipeline execution...")
    try:
        pipeline_script = os.path.join(BASE_DIR, "app", "ml", "pipeline.py")
        
        # Execute the pipeline script
        import subprocess
        result = subprocess.run(
            ["python", pipeline_script],
            capture_output=True,
            text=True,
            check=True
        )
        
        logger.info(f"Pipeline executed successfully. Output: {result.stdout}")
        
        # Reload assets
        load_ml_assets()
        
        return jsonify({
            "status": "Success",
            "message": "Model retrained and reloaded successfully.",
            "metrics": model_metrics
        })
    except subprocess.CalledProcessError as cpe:
        logger.error(f"Pipeline training script error: {cpe.stderr}")
        return jsonify({"error": "Training Script Error", "message": cpe.stderr}), 500
    except Exception as e:
        logger.error(f"Error triggering training: {str(e)}")
        return jsonify({"error": "Training Failed", "message": str(e)}), 500

@app.route("/metrics", methods=["GET"])
def get_metrics():
    """Get active model training metrics."""
    if model_metrics is None:
        load_ml_assets()
        if model_metrics is None:
            return jsonify({"error": "Not Found", "message": "Model metrics file is missing."}), 404
    return jsonify(model_metrics)

@app.route("/model-info", methods=["GET"])
def get_model_info():
    """Get metadata about the model structure."""
    if model_pipeline is None:
        return jsonify({"error": "Not Found", "message": "Model pipeline is not loaded."}), 404
        
    try:
        regressor = model_pipeline.named_steps["regressor"]
        model_name = type(regressor).__name__
        params = regressor.get_params()
        
        # Filter down params to keep payload light
        light_params = {k: v for k, v in params.items() if isinstance(v, (int, float, str, bool, type(None)))}
        
        return jsonify({
            "model_name": model_name,
            "hyperparameters": light_params,
            "feature_names": ["TV", "Radio", "Newspaper", "Total_Spend", "TV_Share", "Radio_Share", "Newspaper_Share", "TV_Radio_Interaction"],
            "target_variable": "Sales"
        })
    except Exception as e:
        return jsonify({"error": "Model Info Error", "message": str(e)}), 500

@app.route("/history", methods=["GET"])
def get_history():
    """Retrieve historical data points for Plotly charts rendering."""
    if not os.path.exists(DATA_PATH):
        return jsonify({"error": "Not Found", "message": f"Historical dataset not found at {DATA_PATH}."}), 404
        
    try:
        df_raw = pd.read_csv(DATA_PATH)
        if "Unnamed: 0" in df_raw.columns:
            df_raw = df_raw.drop(columns=["Unnamed: 0"])
            
        scatter_data = df_raw.to_dict(orient="records")
        corr_matrix = df_raw.corr().to_dict()
        
        # Global importances
        global_shap = xai_results.get("global_shap", []) if xai_results else []
        perm_importance = xai_results.get("permutation_importance", []) if xai_results else []
        
        # Calculate actual vs predicted residuals for validation graphs
        residual_data = []
        if model_pipeline is not None:
            preds = []
            for _, row in df_raw.iterrows():
                pred = run_pipeline_prediction(row["TV"], row["Radio"], row["Newspaper"])
                preds.append(pred)
            df_raw["Predicted"] = preds
            df_raw["Residual"] = df_raw["Sales"] - df_raw["Predicted"]
            residual_data = df_raw[["Sales", "Predicted", "Residual", "TV", "Radio", "Newspaper"]].to_dict(orient="records")
            
        return jsonify({
            "historical_scatter": scatter_data,
            "correlation_matrix": corr_matrix,
            "shap_importance": global_shap,
            "permutation_importance": perm_importance,
            "residuals": residual_data
        })
    except Exception as e:
        logger.error(f"Error loading historical analytics data: {str(e)}")
        return jsonify({"error": "Analytics Error", "message": str(e)}), 500

if __name__ == "__main__":
    # In production, run through Gunicorn or another WSGI server
    app.run(host="127.0.0.1", port=8000, debug=True)
