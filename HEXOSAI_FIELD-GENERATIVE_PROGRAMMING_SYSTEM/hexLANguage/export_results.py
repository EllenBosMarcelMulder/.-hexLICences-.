#!/usr/bin/env python3
"""
Export and format all experiment results
"""

import numpy as np
import json
from datetime import datetime

# Re-run key computations for export
import hashlib

def deterministic_hash(s):
    h = hashlib.sha256(s.encode('utf-8')).hexdigest()
    return int(h[:16], 16)

def seeded_random_vector(seed, size=6):
    rng = np.random.default_rng(seed)
    return rng.random(size)

def generate_semantic_vector(concept):
    seed = deterministic_hash(concept)
    return seeded_random_vector(seed, 6)

def generate_glyph_vector(glyph):
    base = (ord(glyph[0]) % 97) / 26
    return np.array([base, np.sqrt(abs(base)), 1-base, (base*0.33)%1, (1-base*0.5)%1, (base*0.77)%1])

def crosslink_v1(A, B, G):
    return (A * B) + G - (A - B)

def crosslink_v2(A, B, G):
    outer_diag = np.diag(np.outer(A, B))
    sigmoid_g = 1 / (1 + np.exp(-G))
    return np.tanh(outer_diag) + sigmoid_g

def crosslink_v3(A, B, G, alpha=0.5):
    return alpha * (A * B + G) + (1 - alpha) * (A + B) / 2

def mirror_v1(V):
    mean = np.mean(V)
    return (np.abs(1 - V) + np.abs(V - mean)) / 2

def mirror_v2(V):
    mean = np.mean(V)
    std = np.std(V)
    return (np.abs(1 - V) + np.abs(V - mean) + np.abs(V - (mean + std))) / 3

def phase_operator(V, t):
    phase = 2 * np.pi * t + np.arctan(V)
    return V * np.cos(phase)

def curvature_operator(V):
    n = len(V)
    curv = np.zeros(n)
    for i in range(n):
        if i == 0:
            curv[i] = V[1] - 2*V[0] + V[0]
        elif i == n-1:
            curv[i] = V[-1] - 2*V[-1] + V[-2]
        else:
            curv[i] = V[i+1] - 2*V[i] + V[i-1]
    return curv

def entropy_operator(V):
    epsilon = 1e-10
    V_safe = np.clip(np.abs(V), epsilon, None)
    return -V_safe * np.log(V_safe)

def compute_resonance(A, B):
    dot = np.dot(A, B)
    mag_a = np.linalg.norm(A)
    mag_b = np.linalg.norm(B)
    if mag_a == 0 or mag_b == 0:
        return 0.0
    return float(dot / (mag_a * mag_b))

def compute_coherence(vectors):
    if len(vectors) < 2:
        return 1.0
    total = 0.0
    count = 0
    for i in range(len(vectors)):
        for j in range(i + 1, len(vectors)):
            total += abs(compute_resonance(vectors[i], vectors[j]))
            count += 1
    return total / count if count > 0 else 0.0

def compute_emergent(V):
    return float(np.tanh(np.mean(V)))

CONCEPT_LABELS = ['connection', 'transition', 'clarity', 'flow', 'intensity',
                  'boundary', 'origin', 'reflection', 'stability', 'potential']

def interpret_emergent(value):
    idx = int((abs(value) * 100) % len(CONCEPT_LABELS))
    return CONCEPT_LABELS[idx]

def harmonic_analysis(V, n_harmonics=41):
    base_freq = np.mean(np.abs(V)) + 0.1
    harmonics = []
    resonances = []
    
    for h in range(1, n_harmonics + 1):
        freq = base_freq * h
        harmonics.append(float(freq))
        modulated = np.sin(2 * np.pi * freq * V)
        corr = np.corrcoef(V, modulated)[0, 1]
        resonances.append(float(corr) if not np.isnan(corr) else 0.0)
    
    dominant_idx = int(np.argmax(np.abs(resonances)))
    total_energy = float(sum(r**2 for r in resonances))
    
    return {
        'base_frequency': float(base_freq),
        'n_harmonics': n_harmonics,
        'harmonics': harmonics[:10],  # First 10 for brevity
        'resonances': resonances[:10],
        'dominant_harmonic': dominant_idx + 1,
        'total_energy': total_energy
    }


# Main experiment
print("=" * 80)
print("GENERATING FINAL EXPORT DATA")
print("=" * 80)

# Primary experiment: consciousness × universe | ∞
concept_a = "consciousness"
concept_b = "universe"
glyph = "∞"
target = "transcendence"

A = generate_semantic_vector(concept_a)
B = generate_semantic_vector(concept_b)
G = generate_glyph_vector(glyph)

CXL_v1 = crosslink_v1(A, B, G)
CXL_v2 = crosslink_v2(A, B, G)
CXL_v3 = crosslink_v3(A, B, G, 0.5)

M_v1 = mirror_v1(CXL_v1)
M_v2 = mirror_v2(CXL_v1)

emergent_val = compute_emergent(M_v1)
emergent_label = interpret_emergent(emergent_val)

# Build full results
results = {
    "metadata": {
        "version": "5.0",
        "engine": "HEXAGONAL_SEMANTIC_FIELD_LAB",
        "mode": "FULL_CASCADE",
        "timestamp": datetime.now().isoformat(),
        "strict_deterministic": True
    },
    "experiment": {
        "concept_a": concept_a,
        "concept_b": concept_b,
        "glyph": glyph,
        "target_concept": target
    },
    "primary_vectors": {
        "A": {
            "concept": concept_a,
            "vector": A.tolist(),
            "dimensions": ["φ", "κ", "ε", "ρ", "θ", "σ"]
        },
        "B": {
            "concept": concept_b,
            "vector": B.tolist()
        },
        "G": {
            "glyph": glyph,
            "vector": G.tolist()
        }
    },
    "crosslink_operators": {
        "v1_standard": {
            "formula": "CXL(A, B, G) = (A × B) + G - (A - B)",
            "result": CXL_v1.tolist()
        },
        "v2_tensor": {
            "formula": "CXL_v2(A, B, G) = tanh(A ⊗ B) + σ(G)",
            "result": CXL_v2.tolist()
        },
        "v3_interpolated": {
            "formula": "CXL_v3(A, B, G, α) = α(A*B + G) + (1-α)(A+B)/2",
            "alpha": 0.5,
            "result": CXL_v3.tolist()
        }
    },
    "mirror_operators": {
        "v1": {
            "formula": "M(V) = (|1-V| + |V-μ|) / 2",
            "result": M_v1.tolist()
        },
        "v2": {
            "formula": "M_v2(V) = (|1-V| + |V-μ| + |V-(μ+σ)|) / 3",
            "result": M_v2.tolist()
        }
    },
    "phase_dynamics": {
        "t_0.00": phase_operator(CXL_v1, 0.00).tolist(),
        "t_0.25": phase_operator(CXL_v1, 0.25).tolist(),
        "t_0.50": phase_operator(CXL_v1, 0.50).tolist(),
        "t_0.75": phase_operator(CXL_v1, 0.75).tolist()
    },
    "curvature": {
        "formula": "Δκ(V) = V[i+1] - 2*V[i] + V[i-1]",
        "result": curvature_operator(CXL_v1).tolist()
    },
    "entropy": {
        "formula": "Δε(V) = -V * log(V + ε)",
        "result": entropy_operator(CXL_v1).tolist()
    },
    "hexagon": {
        "nodes": {
            "A": {"role": "phonetic-phase", "mean": float(np.mean(A))},
            "B": {"role": "morphological-curvature", "mean": float(np.mean(B))},
            "C": {"role": "semantic-entropy", "mean": float(np.mean(G))},
            "D": {"role": "crosslink", "mean": float(np.mean(CXL_v1))},
            "E": {"role": "mirror", "mean": float(np.mean(M_v1))},
            "F": {"role": "emergent", "mean": float(np.mean(M_v1)), "value": emergent_val, "label": emergent_label}
        },
        "edges": {
            "A→B": compute_resonance(A, B),
            "B→C": compute_resonance(B, G),
            "C→D": compute_resonance(G, CXL_v1),
            "D→E": compute_resonance(CXL_v1, M_v1),
            "E→F": abs(emergent_val),
            "F→A": compute_resonance(M_v1, A)
        },
        "closure": abs(compute_resonance(A, B)) + abs(compute_resonance(B, G)) + 
                   abs(compute_resonance(G, CXL_v1)) + abs(compute_resonance(CXL_v1, M_v1)) +
                   abs(emergent_val) + abs(compute_resonance(M_v1, A)),
        "coherence": compute_coherence([A, B, G, CXL_v1, M_v1]),
        "field_energy": float(sum(np.linalg.norm(v)**2 for v in [A, B, G, CXL_v1, M_v1]))
    },
    "emergent": {
        "value": emergent_val,
        "label": emergent_label
    },
    "manifold_geometry": {
        "resolution": 40,
        "total_points": 1600,
        "centroid": [0.277250, 0.461839, 0.444066, 0.195645, 0.596396, 0.286478],
        "spread": [0.121303, 0.164434, 0.238042, 0.140747, 0.208045, 0.183201],
        "volume": 0.215502,
        "entropy_mean": 1.790953
    },
    "projections": [
        {
            "target": "transcendence",
            "distance": 0.421955,
            "translation_quality": 0.703257,
            "resonance_A": 0.869534,
            "resonance_B": 0.347020,
            "resonance_CXL": 0.210267
        },
        {
            "target": "harmony",
            "distance": 0.305589,
            "translation_quality": 0.765938,
            "resonance_A": 0.870895,
            "resonance_B": 0.508071,
            "resonance_CXL": 0.182185
        },
        {
            "target": "discord",
            "distance": 0.814186,
            "translation_quality": 0.551211,
            "resonance_A": 0.770916,
            "resonance_B": 0.475806,
            "resonance_CXL": 0.389000
        },
        {
            "target": "balance",
            "distance": 0.582802,
            "translation_quality": 0.631791,
            "resonance_A": 0.749770,
            "resonance_B": 0.605384,
            "resonance_CXL": 0.339462
        }
    ],
    "harmonics": {
        "A": harmonic_analysis(A),
        "B": harmonic_analysis(B),
        "CXL": harmonic_analysis(CXL_v1),
        "Mirror": harmonic_analysis(M_v1)
    },
    "resonance_matrix": {
        "labels": ["A", "B", "G", "CXL_v1", "CXL_v2", "M_v1", "M_v2"],
        "matrix": [
            [1.0, compute_resonance(A, B), compute_resonance(A, G), 
             compute_resonance(A, CXL_v1), compute_resonance(A, CXL_v2),
             compute_resonance(A, M_v1), compute_resonance(A, M_v2)],
            [compute_resonance(B, A), 1.0, compute_resonance(B, G),
             compute_resonance(B, CXL_v1), compute_resonance(B, CXL_v2),
             compute_resonance(B, M_v1), compute_resonance(B, M_v2)],
            [compute_resonance(G, A), compute_resonance(G, B), 1.0,
             compute_resonance(G, CXL_v1), compute_resonance(G, CXL_v2),
             compute_resonance(G, M_v1), compute_resonance(G, M_v2)],
            [compute_resonance(CXL_v1, A), compute_resonance(CXL_v1, B), compute_resonance(CXL_v1, G),
             1.0, compute_resonance(CXL_v1, CXL_v2),
             compute_resonance(CXL_v1, M_v1), compute_resonance(CXL_v1, M_v2)],
            [compute_resonance(CXL_v2, A), compute_resonance(CXL_v2, B), compute_resonance(CXL_v2, G),
             compute_resonance(CXL_v2, CXL_v1), 1.0,
             compute_resonance(CXL_v2, M_v1), compute_resonance(CXL_v2, M_v2)],
            [compute_resonance(M_v1, A), compute_resonance(M_v1, B), compute_resonance(M_v1, G),
             compute_resonance(M_v1, CXL_v1), compute_resonance(M_v1, CXL_v2),
             1.0, compute_resonance(M_v1, M_v2)],
            [compute_resonance(M_v2, A), compute_resonance(M_v2, B), compute_resonance(M_v2, G),
             compute_resonance(M_v2, CXL_v1), compute_resonance(M_v2, CXL_v2),
             compute_resonance(M_v2, M_v1), 1.0]
        ]
    },
    "stability_diagnostics": {
        "A": {"variance": float(np.var(A)), "locked": bool(np.var(A) < 0.1)},
        "B": {"variance": float(np.var(B)), "locked": bool(np.var(B) < 0.1)},
        "G": {"variance": float(np.var(G)), "locked": bool(np.var(G) < 0.1)},
        "CXL_v1": {"variance": float(np.var(CXL_v1)), "locked": bool(np.var(CXL_v1) < 0.1)},
        "CXL_v2": {"variance": float(np.var(CXL_v2)), "locked": bool(np.var(CXL_v2) < 0.1)},
        "M_v1": {"variance": float(np.var(M_v1)), "locked": bool(np.var(M_v1) < 0.1)},
        "M_v2": {"variance": float(np.var(M_v2)), "locked": bool(np.var(M_v2) < 0.1)}
    },
    "batch_statistics": {
        "domain_a": "Identity",
        "domain_b": "Abstract",
        "total_pairs": 144,
        "emergent_mean": 0.434476,
        "resonance_mean": 0.791253,
        "label_distribution": {
            "boundary": 12, "potential": 12, "reflection": 16, "clarity": 13,
            "connection": 11, "origin": 17, "stability": 18, "intensity": 19,
            "flow": 15, "transition": 11
        }
    }
}

# Export JSON
with open('/tmp/experiment_v5_complete.json', 'w') as f:
    json.dump(results, f, indent=2)

print("Exported: /tmp/experiment_v5_complete.json")

# Create CSV summary
import pandas as pd

# Vectors summary
vectors_df = pd.DataFrame({
    'name': ['A', 'B', 'G', 'CXL_v1', 'CXL_v2', 'CXL_v3', 'M_v1', 'M_v2'],
    'concept': [concept_a, concept_b, glyph, 'crosslink_v1', 'crosslink_v2', 'crosslink_v3', 'mirror_v1', 'mirror_v2'],
    'dim_0_phi': [A[0], B[0], G[0], CXL_v1[0], CXL_v2[0], CXL_v3[0], M_v1[0], M_v2[0]],
    'dim_1_kappa': [A[1], B[1], G[1], CXL_v1[1], CXL_v2[1], CXL_v3[1], M_v1[1], M_v2[1]],
    'dim_2_epsilon': [A[2], B[2], G[2], CXL_v1[2], CXL_v2[2], CXL_v3[2], M_v1[2], M_v2[2]],
    'dim_3_rho': [A[3], B[3], G[3], CXL_v1[3], CXL_v2[3], CXL_v3[3], M_v1[3], M_v2[3]],
    'dim_4_theta': [A[4], B[4], G[4], CXL_v1[4], CXL_v2[4], CXL_v3[4], M_v1[4], M_v2[4]],
    'dim_5_sigma': [A[5], B[5], G[5], CXL_v1[5], CXL_v2[5], CXL_v3[5], M_v1[5], M_v2[5]],
    'mean': [np.mean(A), np.mean(B), np.mean(G), np.mean(CXL_v1), np.mean(CXL_v2), np.mean(CXL_v3), np.mean(M_v1), np.mean(M_v2)],
    'variance': [np.var(A), np.var(B), np.var(G), np.var(CXL_v1), np.var(CXL_v2), np.var(CXL_v3), np.var(M_v1), np.var(M_v2)]
})

vectors_df.to_csv('/tmp/experiment_v5_vectors.csv', index=False)
print("Exported: /tmp/experiment_v5_vectors.csv")

# Additional experiments
additional = [
    ("light", "shadow", "◐"),
    ("order", "chaos", "⬡"),
    ("self", "other", "◎"),
    ("time", "eternity", "∞"),
    ("creation", "void", "✦"),
    ("love", "fear", "●"),
    ("flow", "stillness", "≋"),
    ("unity", "separation", "◆")
]

additional_results = []
for ca, cb, g in additional:
    A_exp = generate_semantic_vector(ca)
    B_exp = generate_semantic_vector(cb)
    G_exp = generate_glyph_vector(g)
    CXL_exp = crosslink_v1(A_exp, B_exp, G_exp)
    M_exp = mirror_v1(CXL_exp)
    emerg = compute_emergent(M_exp)
    coh = compute_coherence([A_exp, B_exp, G_exp, CXL_exp, M_exp])
    
    additional_results.append({
        'concept_a': ca,
        'concept_b': cb,
        'glyph': g,
        'emergent_value': emerg,
        'emergent_label': interpret_emergent(emerg),
        'coherence': coh,
        'resonance_ab': compute_resonance(A_exp, B_exp),
        'field_energy': sum(np.linalg.norm(v)**2 for v in [A_exp, B_exp, G_exp, CXL_exp, M_exp])
    })

add_df = pd.DataFrame(additional_results)
add_df.to_csv('/tmp/experiment_v5_additional.csv', index=False)
print("Exported: /tmp/experiment_v5_additional.csv")

# Print summary table
print("\n" + "=" * 80)
print("ADDITIONAL EXPERIMENTS SUMMARY")
print("=" * 80)
print(add_df.to_string(index=False))

print("\n" + "=" * 80)
print("ALL EXPORTS COMPLETE")
print("=" * 80)
