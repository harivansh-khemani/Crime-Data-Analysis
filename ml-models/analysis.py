import sys
import json
import math
from datetime import datetime

def get_distance(p1, p2):
    return math.sqrt((p1['lat'] - p2['lat'])**2 + (p1['lng'] - p2['lng'])**2)

def simple_kmeans(data, k=5, iterations=10):
    if not data: return []
    # Initialize centroids by taking first k unique-ish points
    centroids = []
    seen = set()
    for d in data:
        coord = (round(d['lat'], 2), round(d['lng'], 2))
        if coord not in seen:
            centroids.append({'lat': d['lat'], 'lng': d['lng']})
            seen.add(coord)
        if len(centroids) >= k: break
    
    if not centroids: centroids = [{'lat': d['lat'], 'lng': d['lng']} for d in data[:k]]

    for _ in range(iterations):
        clusters = [[] for _ in range(len(centroids))]
        for d in data:
            distances = [get_distance(d, c) for c in centroids]
            closest = distances.index(min(distances))
            clusters[closest].append(d)
        
        for i in range(len(centroids)):
            if clusters[i]:
                centroids[i]['lat'] = sum(d['lat'] for d in clusters[i]) / len(clusters[i])
                centroids[i]['lng'] = sum(d['lng'] for d in clusters[i]) / len(clusters[i])
                centroids[i]['count'] = len(clusters[i])
                types = [d['type'] for d in clusters[i]]
                centroids[i]['type'] = max(set(types), key=types.count)
            else:
                centroids[i]['count'] = 0
    
    return [c for c in centroids if c.get('count', 0) > 0]

def analyze_crimes(data):
    if not data:
        return {"predictions": [], "hotspots": []}

    # 1. Clustering (Simple Hotspots)
    hotspots = simple_kmeans(data, k=8)

    # 2. Forecasting (Simple Trend)
    months = {}
    for d in data:
        m = d.get('date', '2024-01-01')[:7]
        months[m] = months.get(m, 0) + 1
    
    sorted_months = sorted(months.items())
    last_count = sorted_months[-1][1] if sorted_months else len(data) // 12
    
    predictions = []
    for i in range(1, 7):
        # Dummy future months
        month = (10 + i) if (10 + i) <= 12 else (i - 2)
        pred_date = f"2025-{month:02d}"
        predictions.append({
            "date": pred_date,
            "count": int(last_count * (1 + (i * 0.015)))
        })

    return {
        "predictions": predictions,
        "hotspots": hotspots
    }

if __name__ == "__main__":
    try:
        raw_input = sys.stdin.read()
        if not raw_input:
            print(json.dumps({"predictions": [], "hotspots": []}))
            sys.exit(0)
            
        input_data = json.loads(raw_input)
        results = analyze_crimes(input_data)
        print(json.dumps(results))
    except Exception as e:
        print(json.dumps({"predictions": [], "hotspots": [], "error": str(e)}))
