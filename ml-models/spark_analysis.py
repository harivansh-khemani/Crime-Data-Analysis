import sys
import json
import os
from pyspark.sql import SparkSession
from pyspark.sql.functions import col, count, avg, to_date
from pyspark.ml.clustering import KMeans
from pyspark.ml.feature import VectorAssembler

def run_spark_analysis(data_path):
    # Initialize Spark Session
    spark = SparkSession.builder \
        .appName("CrimeDataAnalysis") \
        .getOrCreate()

    # Load Data
    try:
        df = spark.read.csv(data_path, header=True, inferSchema=True)
        
        # 1. Distribution Analysis
        distribution = df.groupBy("type").count().orderBy(col("count").desc())
        dist_list = [row.asDict() for row in distribution.collect()]

        # 2. District Safety Analysis
        districts = df.groupBy("district").agg(
            count("*").alias("crime_count"),
            avg("severity").alias("avg_severity")
        ).orderBy(col("crime_count").desc())
        district_list = [row.asDict() for row in districts.collect()]

        # 3. Hotspot Detection (K-Means Clustering)
        # We use lat/lng for clustering
        feature_cols = ['lat', 'lng']
        assembler = VectorAssembler(inputCols=feature_cols, outputCol="features")
        final_data = assembler.transform(df)

        # Train KMeans model
        kmeans = KMeans().setK(3).setSeed(1) # K=3 clusters for demo
        model = kmeans.fit(final_data)

        # Get Cluster Centers (Hotspots)
        centers = model.clusterCenters()
        hotspots = []
        for i, center in enumerate(centers):
            hotspots.append({
                "id": i,
                "lat": float(center[0]),
                "lng": float(center[1])
            })

        spark.stop()

        return {
            "distribution": dist_list,
            "districts": district_list,
            "hotspots": hotspots
        }

    except Exception as e:
        spark.stop()
        return {"error": str(e)}

if __name__ == "__main__":
    # Get data path from arguments or default
    data_path = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), "../datasets/crime_data.csv")
    
    results = run_spark_analysis(data_path)
    print(json.dumps(results))
