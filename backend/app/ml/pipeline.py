import os
import joblib
import numpy as np
import pandas as pd
from typing import Tuple, Dict, Any
from sklearn.model_selection import train_test_split, cross_val_score, KFold
from sklearn.preprocessing import StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LinearRegression, Ridge, Lasso
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from xgboost import XGBRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

# ==========================================
# 1. DATA LOADING & STRUCTURAL CLEANING
# ==========================================

def load_data(filepath: str) -> pd.DataFrame:
    """Loads the advertising dataset from a CSV file."""
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"Dataset not found at {filepath}")
    df = pd.read_csv(filepath)
    print(f"[LOAD] Data loaded successfully. Shape: {df.shape}")
    return df

def clean_structure(df: pd.DataFrame) -> pd.DataFrame:
    """Removes indexing columns and drops duplicate rows."""
    df_cleaned = df.copy()
    
    # Drop indexing column typical in ISLR datasets
    if "Unnamed: 0" in df_cleaned.columns:
        df_cleaned = df_cleaned.drop(columns=["Unnamed: 0"])
        print("[CLEAN] Dropped index column 'Unnamed: 0'")
        
    # Remove duplicate rows
    initial_rows = len(df_cleaned)
    df_cleaned = df_cleaned.drop_duplicates()
    dropped_duplicates = initial_rows - len(df_cleaned)
    if dropped_duplicates > 0:
        print(f"[CLEAN] Removed {dropped_duplicates} duplicate row(s)")
    else:
        print("[CLEAN] No duplicate rows detected.")
        
    return df_cleaned

# ==========================================
# 2. OUTLIER & SKEWNESS TREATMENT
# ==========================================

def treat_outliers_iqr(df: pd.DataFrame, columns: list) -> pd.DataFrame:
    """Caps numerical outliers using the IQR bounds (Winsorization)."""
    df_clean = df.copy()
    for col in columns:
        q1 = df_clean[col].quantile(0.25)
        q3 = df_clean[col].quantile(0.75)
        iqr = q3 - q1
        lower_bound = q1 - 1.5 * iqr
        upper_bound = q3 + 1.5 * iqr
        
        # Capping outliers to upper and lower bounds
        df_clean[col] = np.clip(df_clean[col], lower_bound, upper_bound)
        print(f"[OUTLIER] Outliers treated for '{col}' using IQR boundaries: [{lower_bound:.2f}, {upper_bound:.2f}]")
    return df_clean

def transform_skewed_features(df: pd.DataFrame, columns: list, threshold: float = 0.75) -> pd.DataFrame:
    """Applies log transformation (log1p) to right-skewed features above the threshold."""
    df_transformed = df.copy()
    for col in columns:
        skewness = df_transformed[col].skew()
        if skewness > threshold:
            df_transformed[col] = np.log1p(df_transformed[col])
            print(f"[TRANSFORM] Applied log1p transformation to skewed feature '{col}' (skew: {skewness:.4f})")
    return df_transformed

# ==========================================
# 3. ADVANCED FEATURE ENGINEERING
# ==========================================

def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    """Creates advanced features: Total Spend, Channel Shares, and TV-Radio Interaction."""
    df_eng = df.copy()
    
    # Newspaper is log-transformed in transform_skewed_features
    # To get raw Newspaper spend, we reverse the log1p transform.
    if df_eng["Newspaper"].max() < 6.0:
        newspaper_raw = np.expm1(df_eng["Newspaper"])
    else:
        newspaper_raw = df_eng["Newspaper"]
        
    # A. Total Budget Scale
    df_eng["Total_Spend"] = df_eng["TV"] + df_eng["Radio"] + newspaper_raw
    
    # B. Channel Budget Shares (relative allocation mix)
    df_eng["TV_Share"] = df_eng["TV"] / (df_eng["Total_Spend"] + 1e-5)
    df_eng["Radio_Share"] = df_eng["Radio"] / (df_eng["Total_Spend"] + 1e-5)
    df_eng["Newspaper_Share"] = newspaper_raw / (df_eng["Total_Spend"] + 1e-5)
    
    # C. Synergy / Interaction Term
    df_eng["TV_Radio_Interaction"] = df_eng["TV"] * df_eng["Radio"]
    
    print("[ENGINEERING] Created engineered features: Total_Spend, Shares, TV_Radio_Interaction")
    return df_eng

# ==========================================
# 4. PREPROCESSING PIPELINE (SCALING)
# ==========================================

def build_preprocessor(numerical_cols: list) -> ColumnTransformer:
    """Creates a ColumnTransformer to handle imputation and scaling for numerical features."""
    numerical_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='median')),
        ('scaler', StandardScaler())
    ])
    
    # Bundle preprocessing
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', numerical_transformer, numerical_cols)
        ]
    )
    return preprocessor

# ==========================================
# 5. MULTI-MODEL TRAINING & EVALUATION
# ==========================================

def run_model_comparison(
    X_train: pd.DataFrame, 
    X_test: pd.DataFrame, 
    y_train: pd.Series, 
    y_test: pd.Series,
    preprocessor: ColumnTransformer
) -> Tuple[Dict[str, Pipeline], pd.DataFrame]:
    """Trains 7 models, evaluates them on test metrics and cross-validation, and returns comparison."""
    
    models = {
        "Linear Regression": LinearRegression(),
        "Ridge Regression": Ridge(alpha=1.0),
        "Lasso Regression": Lasso(alpha=0.1),
        "Decision Tree": DecisionTreeRegressor(max_depth=6, random_state=42),
        "Random Forest": RandomForestRegressor(n_estimators=100, random_state=42),
        "Gradient Boosting": GradientBoostingRegressor(n_estimators=100, random_state=42),
        "XGBoost": XGBRegressor(n_estimators=100, max_depth=6, learning_rate=0.1, random_state=42)
    }
    
    pipelines = {}
    metrics_list = []
    
    kf = KFold(n_splits=5, shuffle=True, random_state=42)
    
    print("\n--- Model Training & Cross Validation (5-Fold) ---")
    for name, model in models.items():
        # Build end-to-end pipeline
        pipeline = Pipeline(steps=[
            ('preprocessor', preprocessor),
            ('regressor', model)
        ])
        
        # Cross Validation (R2) on complete training set
        cv_scores = cross_val_score(pipeline, X_train, y_train, cv=kf, scoring='r2')
        cv_mean = cv_scores.mean()
        cv_std = cv_scores.std()
        
        # Fit model on training set
        pipeline.fit(X_train, y_train)
        pipelines[name] = pipeline
        
        # Evaluate on test set
        y_pred = pipeline.predict(X_test)
        mae = mean_absolute_error(y_test, y_pred)
        mse = mean_squared_error(y_test, y_pred)
        rmse = np.sqrt(mse)
        r2 = r2_score(y_test, y_pred)
        
        metrics_list.append({
            "Model": name,
            "MAE": mae,
            "MSE": mse,
            "RMSE": rmse,
            "R2 (Test)": r2,
            "CV R2 (Mean)": cv_mean,
            "CV R2 (Std)": cv_std
        })
        
        print(f"  Finished: {name} (Test R2: {r2:.4f} | CV R2: {cv_mean:.4f})")
        
    df_metrics = pd.DataFrame(metrics_list)
    return pipelines, df_metrics

# ==========================================
# 6. EXECUTION ENTRY POINT
# ==========================================

def main(data_path: str, output_dir: str):
    """Orchestrates the entire cleaning, engineering, preprocessing, and training workflow."""
    os.makedirs(output_dir, exist_ok=True)
    os.makedirs(os.path.dirname(data_path), exist_ok=True)
    
    # Load and clean
    df = load_data(data_path)
    df_cleaned = clean_structure(df)
    
    features = [col for col in df_cleaned.columns if col != 'Sales']
    target = 'Sales'
    
    # Treat outliers (Winsorization)
    df_cleaned = treat_outliers_iqr(df_cleaned, features)
    
    # Log transforms for skewed features (Newspaper)
    df_cleaned = transform_skewed_features(df_cleaned, features, threshold=0.75)
    
    # Extract features & target
    X_raw = df_cleaned[features]
    y = df_cleaned[target]
    
    # Advanced Feature Engineering
    X_eng = engineer_features(X_raw)
    
    # Split dataset (80% Train, 20% Test)
    X_train, X_test, y_train, y_test = train_test_split(
        X_eng, y, test_size=0.2, random_state=42
    )
    print(f"[SPLIT] Dataset Split: Train={X_train.shape}, Test={X_test.shape}")
    
    # All features are numerical
    numerical_cols = X_eng.columns.tolist()
    
    # Build preprocessor
    preprocessor = build_preprocessor(numerical_cols)
    
    # Run comparison
    pipelines, df_metrics = run_model_comparison(X_train, X_test, y_train, y_test, preprocessor)
    
    # Sort comparison table by R2 (Test)
    df_metrics = df_metrics.sort_values(by="R2 (Test)", ascending=False)
    print("\n--- FINAL MODEL COMPARISON ---")
    print(df_metrics.to_markdown(index=False))
    
    # Automatically choose best model based on R2 (Test)
    best_model_row = df_metrics.iloc[0]
    best_model_name = best_model_row["Model"]
    best_pipeline = pipelines[best_model_name]
    
    print(f"\n[BEST MODEL] Best Model Selected: {best_model_name}")
    print(f"   - Test R2: {best_model_row['R2 (Test)']:.5f}")
    print(f"   - CV R2 (Mean): {best_model_row['CV R2 (Mean)']:.5f}")
    
    # Save the best model pipeline and training metrics
    model_path = os.path.join(output_dir, "sales_model.joblib")
    joblib.dump(best_pipeline, model_path)
    
    # Save metadata/metrics
    metrics_path = os.path.join(output_dir, "model_metrics.joblib")
    best_metrics = {
        "Model": best_model_name,
        "MAE": best_model_row["MAE"],
        "MSE": best_model_row["MSE"],
        "RMSE": best_model_row["RMSE"],
        "R2": best_model_row["R2 (Test)"],
        "CV_R2_Mean": best_model_row["CV R2 (Mean)"],
        "CV_R2_Std": best_model_row["CV R2 (Std)"]
    }
    joblib.dump(best_metrics, metrics_path)
    
    # Save all comparison metrics as CSV in output_dir for analytics dashboard usage
    comparison_path = os.path.join(output_dir, "model_comparison.csv")
    df_metrics.to_csv(comparison_path, index=False)
    
    print(f"[SAVE] Serialized best pipeline to: {model_path}")
    print(f"[SAVE] Serialized model metrics to: {metrics_path}")
    print(f"[SAVE] Serialized comparison report to: {comparison_path}")

if __name__ == "__main__":
    main(
        data_path="d:/Sales Intelligence AI/backend/data/Advertising.csv",
        output_dir="d:/Sales Intelligence AI/backend/models"
    )
