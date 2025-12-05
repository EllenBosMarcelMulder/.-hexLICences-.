#!/usr/bin/env python3
"""
╔═══════════════════════════════════════════════════════════════════════════════╗
║     SEMANTIC-FIELD EXPERIMENT SET v5.0                                        ║
║     ENGINE: HEXAGONAL SEMANTIC FIELD LAB + EXTENDED FIELD OPERATORS           ║
║     MODE: FULL CASCADE                                                        ║
╚═══════════════════════════════════════════════════════════════════════════════╝
"""

import numpy as np
import pandas as pd
from typing import Dict, List, Tuple, Optional, Any
from dataclasses import dataclass, asdict
import json
from datetime import datetime
import hashlib

# ============================================================================
# CONFIGURATION
# ============================================================================

EXPERIMENT_CONFIG = {
    'version': '5.0',
    'engine': 'HEXAGONAL_SEMANTIC_FIELD_LAB',
    'mode': 'FULL_CASCADE',
    'strict_deterministic': True,
    'seed': 42
}

# Dimension labels for 6D semantic vectors
DIMENSION_LABELS = ['φ (phase)', 'κ (curvature)', 'ε (entropy)', 
                    'ρ (direction)', 'θ (intensity)', 'σ (stability)']

CONCEPT_LABELS = ['connection', 'transition', 'clarity', 'flow', 'intensity',
                  'boundary', 'origin', 'reflection', 'stability', 'potential']

CONCEPT_DOMAINS = {
    'Nature': ['flow', 'storm', 'mountain', 'light', 'darkness', 'earth', 
               'river', 'wind', 'stone', 'fire', 'water', 'sky', 'forest', 'ocean'],
    'Emotion': ['fear', 'joy', 'anger', 'calm', 'desire', 'sorrow', 
                'trust', 'confusion', 'hope', 'love', 'peace', 'rage'],
    'Abstract': ['time', 'change', 'order', 'chaos', 'unity', 'boundary', 
                 'growth', 'decay', 'cycle', 'void', 'infinity', 'zero'],
    'Identity': ['self', 'memory', 'intention', 'awareness', 'choice', 
                 'expression', 'origin', 'destiny', 'will', 'spirit', 'soul', 'mind']
}

GLYPHS = ['▲', '●', '◎', '■', '◆', '★', '◐', '◑', '▼', '◯', '⬡', '⬢', '✦', '⚡', '∞', '≋']


# ============================================================================
# STRICT DETERMINISTIC HASH FUNCTION
# ============================================================================

def deterministic_hash(s: str) -> int:
    """Generate strictly deterministic hash for reproducibility"""
    h = hashlib.sha256(s.encode('utf-8')).hexdigest()
    return int(h[:16], 16)


def seeded_random_vector(seed: int, size: int = 6) -> np.ndarray:
    """Generate deterministic random vector from seed"""
    rng = np.random.default_rng(seed)
    return rng.random(size)


# ============================================================================
# TASK 2: PRIMARY VECTOR GENERATORS
# ============================================================================

def generate_semantic_vector(concept: str) -> np.ndarray:
    """
    GenerateSemanticVector(concept)
    
    Produces 6D vector: [φ, κ, ε, ρ, θ, σ]
    - φ: expressive modulation / phase
    - κ: structural relation / curvature
    - ε: interpretative ambiguity / entropy
    - ρ: directional relation
    - θ: intensity
    - σ: stability
    """
    seed = deterministic_hash(concept)
    return seeded_random_vector(seed, 6)


def generate_glyph_vector(glyph: str) -> np.ndarray:
    """
    GenerateGlyphVector(glyph)
    
    Glyph acts as semantic stabilizer/anchor.
    Uses character encoding to generate consistent vector.
    """
    base = (ord(glyph[0]) % 97) / 26
    return np.array([
        base,
        np.sqrt(abs(base)),
        1 - base,
        (base * 0.33) % 1,
        (1 - base * 0.5) % 1,
        (base * 0.77) % 1
    ])


# ============================================================================
# TASK 3: CROSS-LINKED OPERATORS
# ============================================================================

def crosslink_v1(A: np.ndarray, B: np.ndarray, G: np.ndarray) -> np.ndarray:
    """
    CrossLink_v1: Standard operator
    Formula: CXL(A, B, G) = (A × B) + G - (A - B)
    """
    return (A * B) + G - (A - B)


def crosslink_v2(A: np.ndarray, B: np.ndarray, G: np.ndarray) -> np.ndarray:
    """
    CrossLink_v2: Tensor-like operation
    Formula: CXL_v2(A, B, G) = tanh(A ⊗ B) + σ(G)
    """
    outer_diag = np.diag(np.outer(A, B))
    sigmoid_g = 1 / (1 + np.exp(-G))
    return np.tanh(outer_diag) + sigmoid_g


def crosslink_v3(A: np.ndarray, B: np.ndarray, G: np.ndarray, alpha: float = 0.5) -> np.ndarray:
    """
    CrossLink_v3: Weighted interpolation
    Formula: CXL_v3(A, B, G, α) = α(A*B + G) + (1-α)(A+B)/2
    """
    multiplicative = A * B + G
    additive = (A + B) / 2
    return alpha * multiplicative + (1 - alpha) * additive


def mirror_v1(V: np.ndarray) -> np.ndarray:
    """
    Mirror_v1: Standard mirror operator
    Formula: M(V) = (|1 - V| + |V - μ|) / 2
    """
    mean = np.mean(V)
    direct = np.abs(1 - V)
    deep = np.abs(V - mean)
    return (direct + deep) / 2


def mirror_v2(V: np.ndarray) -> np.ndarray:
    """
    Mirror_v2: Enhanced with harmonic deviation
    Formula: M_v2(V) = (|1-V| + |V-μ| + |V-(μ+σ)|) / 3
    """
    mean = np.mean(V)
    std = np.std(V)
    direct = np.abs(1 - V)
    deep = np.abs(V - mean)
    harmonic = np.abs(V - (mean + std))
    return (direct + deep + harmonic) / 3


def phase_operator(V: np.ndarray, t: float) -> np.ndarray:
    """
    PhaseOperator(V, t)
    Formula: ΔΦ(V, t) = V * cos(2πt + arctan(V))
    """
    phase = 2 * np.pi * t + np.arctan(V)
    return V * np.cos(phase)


def curvature_operator(V: np.ndarray) -> np.ndarray:
    """
    CurvatureOperator(V)
    Formula: Δκ(V) = V[i+1] - 2*V[i] + V[i-1]
    Second derivative approximation
    """
    n = len(V)
    curvature = np.zeros(n)
    for i in range(n):
        if i == 0:
            curvature[i] = V[1] - 2*V[0] + V[0]
        elif i == n-1:
            curvature[i] = V[-1] - 2*V[-1] + V[-2]
        else:
            curvature[i] = V[i+1] - 2*V[i] + V[i-1]
    return curvature


def entropy_operator(V: np.ndarray) -> np.ndarray:
    """
    EntropyOperator(V)
    Formula: Δε(V) = -V * log(V + ε)
    """
    epsilon = 1e-10
    V_safe = np.clip(np.abs(V), epsilon, None)
    return -V_safe * np.log(V_safe)


def coupling_operator(A: np.ndarray, B: np.ndarray, strength: float) -> Tuple[np.ndarray, np.ndarray]:
    """
    CouplingOperator(A, B, strength)
    Creates bidirectional coupling between vectors
    """
    resonance = compute_resonance(A, B)
    coupling_factor = strength * resonance
    A_coupled = A + coupling_factor * (B - A)
    B_coupled = B + coupling_factor * (A - B)
    return A_coupled, B_coupled


def lock_condition(V: np.ndarray, threshold: float = 0.10) -> Tuple[bool, float, str]:
    """
    LockCondition(V, threshold)
    Returns: (is_locked, stability_score, status)
    """
    variance = np.var(V)
    is_locked = variance < threshold
    stability = 1 / (1 + variance)
    status = "LOCKED" if is_locked else "UNLOCKED"
    return is_locked, stability, status


# ============================================================================
# TASK 4: HEXAGON CONSTRUCTION
# ============================================================================

def compute_resonance(A: np.ndarray, B: np.ndarray) -> float:
    """Cosine similarity between vectors"""
    dot = np.dot(A, B)
    mag_a = np.linalg.norm(A)
    mag_b = np.linalg.norm(B)
    if mag_a == 0 or mag_b == 0:
        return 0.0
    return float(dot / (mag_a * mag_b))


def compute_coherence(vectors: List[np.ndarray]) -> float:
    """Average pairwise resonance"""
    if len(vectors) < 2:
        return 1.0
    total = 0.0
    count = 0
    for i in range(len(vectors)):
        for j in range(i + 1, len(vectors)):
            total += abs(compute_resonance(vectors[i], vectors[j]))
            count += 1
    return total / count if count > 0 else 0.0


def compute_field_energy(vectors: List[np.ndarray]) -> float:
    """Sum of squared magnitudes"""
    return sum(np.linalg.norm(v)**2 for v in vectors)


def compute_emergent(V: np.ndarray) -> float:
    """E(V) = tanh(μ(V))"""
    return float(np.tanh(np.mean(V)))


def interpret_emergent(value: float) -> str:
    """Map emergent to conceptual label"""
    idx = int((abs(value) * 100) % len(CONCEPT_LABELS))
    return CONCEPT_LABELS[idx]


def build_hexagon(A: np.ndarray, B: np.ndarray, G: np.ndarray, 
                  CXL: np.ndarray, M: np.ndarray) -> Dict:
    """
    Build complete hexagon structure with all metrics
    """
    emergent_value = compute_emergent(M)
    emergent_label = interpret_emergent(emergent_value)
    
    # Nodes
    nodes = {
        'A': {'vector': A.tolist(), 'type': 'input', 'role': 'phonetic-phase', 'mean': float(np.mean(A))},
        'B': {'vector': B.tolist(), 'type': 'input', 'role': 'morphological-curvature', 'mean': float(np.mean(B))},
        'C': {'vector': G.tolist(), 'type': 'stabilizer', 'role': 'semantic-entropy', 'mean': float(np.mean(G))},
        'D': {'vector': CXL.tolist(), 'type': 'derived', 'role': 'crosslink', 'mean': float(np.mean(CXL))},
        'E': {'vector': M.tolist(), 'type': 'derived', 'role': 'mirror', 'mean': float(np.mean(M))},
        'F': {'vector': M.tolist(), 'type': 'output', 'role': 'emergent', 'mean': float(np.mean(M)),
              'emergent_value': emergent_value, 'emergent_label': emergent_label}
    }
    
    # Edges with resonance
    edges = {
        'A→B': compute_resonance(A, B),
        'B→C': compute_resonance(B, G),
        'C→D': compute_resonance(G, CXL),
        'D→E': compute_resonance(CXL, M),
        'E→F': abs(emergent_value),
        'F→A': compute_resonance(M, A),
        'A→D': compute_resonance(A, CXL),
        'B→D': compute_resonance(B, CXL),
        'C→E': compute_resonance(G, M)
    }
    
    # Hexagon closure (sum of primary edge weights)
    primary_edges = ['A→B', 'B→C', 'C→D', 'D→E', 'E→F', 'F→A']
    closure = sum(abs(edges[e]) for e in primary_edges)
    
    # Field metrics
    all_vectors = [A, B, G, CXL, M]
    coherence = compute_coherence(all_vectors)
    field_energy = compute_field_energy(all_vectors)
    
    return {
        'nodes': nodes,
        'edges': edges,
        'closure': closure,
        'coherence': coherence,
        'field_energy': field_energy,
        'emergent_value': emergent_value,
        'emergent_label': emergent_label
    }


# ============================================================================
# TASK 5: MANIFOLD RECONSTRUCTION
# ============================================================================

def reconstruct_manifold(A: np.ndarray, B: np.ndarray, G: np.ndarray,
                         resolution: int = 10) -> Dict:
    """
    Reconstruct semantic manifold from three projections
    Resolution: 10 → 40 (as specified)
    """
    t_values = np.linspace(0, 1, resolution)
    s_values = np.linspace(0, 1, resolution)
    
    manifold_points = []
    all_points = []
    
    for t in t_values:
        for s in s_values:
            # Barycentric interpolation
            w_a = (1 - t) * (1 - s)
            w_b = t * (1 - s)
            w_g = s
            
            point = w_a * A + w_b * B + w_g * G
            all_points.append(point)
            
            # Compute operators at this point
            phase_0 = phase_operator(point, 0.0)
            phase_25 = phase_operator(point, 0.25)
            phase_50 = phase_operator(point, 0.5)
            phase_75 = phase_operator(point, 0.75)
            curv = curvature_operator(point)
            entr = entropy_operator(point)
            
            manifold_points.append({
                't': t, 's': s,
                'weights': {'w_a': w_a, 'w_b': w_b, 'w_g': w_g},
                'point': point.tolist(),
                'phase_0': phase_0.tolist(),
                'phase_25': phase_25.tolist(),
                'phase_50': phase_50.tolist(),
                'phase_75': phase_75.tolist(),
                'curvature': curv.tolist(),
                'entropy': entr.tolist(),
                'point_entropy_sum': float(np.sum(entr))
            })
    
    all_points = np.array(all_points)
    
    # Manifold geometry
    centroid = np.mean(all_points, axis=0)
    spread = np.std(all_points, axis=0)
    min_coords = np.min(all_points, axis=0)
    max_coords = np.max(all_points, axis=0)
    volume = float(np.prod(max_coords - min_coords))
    entropy_mean = np.mean([p['point_entropy_sum'] for p in manifold_points])
    
    return {
        'resolution': resolution,
        'total_points': len(manifold_points),
        'points': manifold_points,
        'geometry': {
            'centroid': centroid.tolist(),
            'spread': spread.tolist(),
            'min': min_coords.tolist(),
            'max': max_coords.tolist(),
            'volume': volume,
            'entropy_mean': entropy_mean
        }
    }


# ============================================================================
# TASK 6: MANIFOLD PROJECTION
# ============================================================================

def project_to_manifold(target_concept: str, manifold: Dict,
                        A: np.ndarray, B: np.ndarray, CXL: np.ndarray) -> Dict:
    """
    Project target concept onto manifold
    Compute translation quality metrics
    """
    target_vec = generate_semantic_vector(target_concept)
    
    # Find closest point on manifold
    min_dist = float('inf')
    closest_point = None
    closest_params = None
    
    for p in manifold['points']:
        point = np.array(p['point'])
        dist = np.linalg.norm(target_vec - point)
        if dist < min_dist:
            min_dist = dist
            closest_point = point
            closest_params = (p['t'], p['s'])
    
    # Compute resonances
    resonance_A = compute_resonance(target_vec, A)
    resonance_B = compute_resonance(target_vec, B)
    resonance_CXL = compute_resonance(target_vec, CXL)
    
    # Translation quality
    translation_quality = 1 / (1 + min_dist)
    
    return {
        'target_concept': target_concept,
        'target_vector': target_vec.tolist(),
        'projected_point': closest_point.tolist() if closest_point is not None else None,
        'projection_params': {'t': closest_params[0], 's': closest_params[1]} if closest_params else None,
        'projection_distance': min_dist,
        'resonance': {
            'with_A': resonance_A,
            'with_B': resonance_B,
            'with_CXL': resonance_CXL
        },
        'translation_quality': translation_quality
    }


# ============================================================================
# TASK 7: HARMONIC MODULATION
# ============================================================================

def run_harmonic_analysis(V: np.ndarray, n_harmonics: int = 41) -> Dict:
    """
    Full harmonic modulation analysis
    Harmonics: 6 → 41 as specified
    """
    base_freq = np.mean(np.abs(V)) + 0.1
    
    harmonics = []
    resonances = []
    energies = []
    
    for h in range(1, n_harmonics + 1):
        freq = base_freq * h
        harmonics.append(freq)
        
        # Compute modulated signal
        modulated = np.sin(2 * np.pi * freq * V)
        
        # Correlation as resonance measure
        corr = np.corrcoef(V, modulated)[0, 1]
        corr = corr if not np.isnan(corr) else 0.0
        resonances.append(corr)
        
        # Harmonic energy
        energy = np.sum(modulated ** 2)
        energies.append(energy)
    
    dominant_idx = int(np.argmax(np.abs(resonances)))
    total_energy = sum(r**2 for r in resonances)
    
    return {
        'base_frequency': base_freq,
        'n_harmonics': n_harmonics,
        'harmonics': harmonics,
        'resonances': resonances,
        'energies': energies,
        'dominant_harmonic': dominant_idx + 1,
        'dominant_frequency': harmonics[dominant_idx],
        'dominant_resonance': resonances[dominant_idx],
        'total_harmonic_energy': total_energy,
        'energy_distribution': {
            f'H{i+1}': energies[i] for i in range(min(10, len(energies)))
        }
    }


# ============================================================================
# TASK 8: BATCH MODE
# ============================================================================

def run_batch_mode(domain_a: str, domain_b: str, glyph: str) -> Dict:
    """
    Run batch evaluation across two domains
    """
    concepts_a = CONCEPT_DOMAINS.get(domain_a, [])
    concepts_b = CONCEPT_DOMAINS.get(domain_b, [])
    G = generate_glyph_vector(glyph)
    
    results = []
    
    for ca in concepts_a:
        A = generate_semantic_vector(ca)
        for cb in concepts_b:
            B = generate_semantic_vector(cb)
            
            # Compute crosslink and mirror
            CXL = crosslink_v1(A, B, G)
            M = mirror_v1(CXL)
            emergent = compute_emergent(M)
            
            results.append({
                'concept_a': ca,
                'concept_b': cb,
                'glyph': glyph,
                'vec_a': A.tolist(),
                'vec_b': B.tolist(),
                'vec_cxl': CXL.tolist(),
                'vec_mirror': M.tolist(),
                'resonance_ab': compute_resonance(A, B),
                'emergent_value': emergent,
                'emergent_label': interpret_emergent(emergent)
            })
    
    # Aggregate statistics
    emergent_values = [r['emergent_value'] for r in results]
    resonance_values = [r['resonance_ab'] for r in results]
    
    label_dist = {}
    for r in results:
        label = r['emergent_label']
        label_dist[label] = label_dist.get(label, 0) + 1
    
    return {
        'domain_a': domain_a,
        'domain_b': domain_b,
        'glyph': glyph,
        'total_pairs': len(results),
        'results': results,
        'statistics': {
            'emergent': {
                'mean': float(np.mean(emergent_values)),
                'std': float(np.std(emergent_values)),
                'min': float(np.min(emergent_values)),
                'max': float(np.max(emergent_values))
            },
            'resonance': {
                'mean': float(np.mean(resonance_values)),
                'std': float(np.std(resonance_values)),
                'min': float(np.min(resonance_values)),
                'max': float(np.max(resonance_values))
            },
            'label_distribution': label_dist
        }
    }


# ============================================================================
# FULL EXPERIMENT RUNNER
# ============================================================================

class SemanticFieldExperiment:
    """
    Complete Semantic Field Experiment v5.0
    """
    
    def __init__(self, concept_a: str, concept_b: str, glyph: str,
                 target_concept: str = None,
                 batch_domain_a: str = None,
                 batch_domain_b: str = None):
        
        self.config = EXPERIMENT_CONFIG.copy()
        self.config['concept_a'] = concept_a
        self.config['concept_b'] = concept_b
        self.config['glyph'] = glyph
        self.config['target_concept'] = target_concept
        self.config['batch_domain_a'] = batch_domain_a
        self.config['batch_domain_b'] = batch_domain_b
        self.config['timestamp'] = datetime.now().isoformat()
        
        # Initialize
        self.concept_a = concept_a
        self.concept_b = concept_b
        self.glyph = glyph
        self.target_concept = target_concept or "translation"
        
        # Results storage
        self.results = {}
        
    def run_full_cascade(self) -> Dict:
        """Execute all tasks in sequence"""
        
        print("=" * 80)
        print("SEMANTIC-FIELD EXPERIMENT SET v5.0 - FULL CASCADE")
        print("=" * 80)
        print()
        
        # TASK 1: INITIALIZE FIELD
        print("TASK 1: INITIALIZE FIELD")
        print("-" * 40)
        print(f"  Concept_A: {self.concept_a}")
        print(f"  Concept_B: {self.concept_b}")
        print(f"  Glyph: {self.glyph}")
        print(f"  Strict Deterministic Mode: ON")
        print()
        
        # TASK 2: COMPUTE PRIMARY VECTORS
        print("TASK 2: COMPUTE PRIMARY VECTORS")
        print("-" * 40)
        
        self.vec_a = generate_semantic_vector(self.concept_a)
        self.vec_b = generate_semantic_vector(self.concept_b)
        self.vec_g = generate_glyph_vector(self.glyph)
        
        print(f"  A = [{', '.join(f'{v:.6f}' for v in self.vec_a)}]")
        print(f"  B = [{', '.join(f'{v:.6f}' for v in self.vec_b)}]")
        print(f"  G = [{', '.join(f'{v:.6f}' for v in self.vec_g)}]")
        print()
        
        self.results['primary_vectors'] = {
            'A': {'concept': self.concept_a, 'vector': self.vec_a.tolist()},
            'B': {'concept': self.concept_b, 'vector': self.vec_b.tolist()},
            'G': {'glyph': self.glyph, 'vector': self.vec_g.tolist()}
        }
        
        # TASK 3: EXECUTE CROSS-LINKED OPERATORS
        print("TASK 3: EXECUTE CROSS-LINKED OPERATORS")
        print("-" * 40)
        
        # CrossLink variants
        self.cxl_v1 = crosslink_v1(self.vec_a, self.vec_b, self.vec_g)
        self.cxl_v2 = crosslink_v2(self.vec_a, self.vec_b, self.vec_g)
        self.cxl_v3_03 = crosslink_v3(self.vec_a, self.vec_b, self.vec_g, alpha=0.3)
        self.cxl_v3_05 = crosslink_v3(self.vec_a, self.vec_b, self.vec_g, alpha=0.5)
        self.cxl_v3_07 = crosslink_v3(self.vec_a, self.vec_b, self.vec_g, alpha=0.7)
        self.cxl_v3_10 = crosslink_v3(self.vec_a, self.vec_b, self.vec_g, alpha=1.0)
        
        print("  CrossLink_v1: (A × B) + G - (A - B)")
        print(f"    [{', '.join(f'{v:.6f}' for v in self.cxl_v1)}]")
        print("  CrossLink_v2: tanh(A ⊗ B) + σ(G)")
        print(f"    [{', '.join(f'{v:.6f}' for v in self.cxl_v2)}]")
        print("  CrossLink_v3 (α=0.5): interpolated")
        print(f"    [{', '.join(f'{v:.6f}' for v in self.cxl_v3_05)}]")
        print()
        
        # Mirror variants
        self.mirror_v1_result = mirror_v1(self.cxl_v1)
        self.mirror_v2_result = mirror_v2(self.cxl_v1)
        
        print("  Mirror_v1: (|1-V| + |V-μ|) / 2")
        print(f"    [{', '.join(f'{v:.6f}' for v in self.mirror_v1_result)}]")
        print("  Mirror_v2: (|1-V| + |V-μ| + |V-(μ+σ)|) / 3")
        print(f"    [{', '.join(f'{v:.6f}' for v in self.mirror_v2_result)}]")
        print()
        
        # Phase Operator at multiple t values
        print("  PhaseOperator at t = [0.0, 0.25, 0.5, 0.75]:")
        phase_results = {}
        for t in [0.0, 0.25, 0.5, 0.75]:
            phase = phase_operator(self.cxl_v1, t)
            phase_results[f't={t}'] = phase.tolist()
            print(f"    t={t}: [{', '.join(f'{v:.6f}' for v in phase)}]")
        print()
        
        # Curvature Operator
        curv = curvature_operator(self.cxl_v1)
        print("  CurvatureOperator:")
        print(f"    [{', '.join(f'{v:.6f}' for v in curv)}]")
        print()
        
        # Entropy Operator
        entr = entropy_operator(self.cxl_v1)
        print("  EntropyOperator:")
        print(f"    [{', '.join(f'{v:.6f}' for v in entr)}]")
        print()
        
        # Coupling Operator at multiple strengths
        print("  CouplingOperator (strength = 0.3 → 1.0):")
        coupling_results = {}
        for strength in [0.3, 0.5, 0.7, 1.0]:
            A_c, B_c = coupling_operator(self.vec_a, self.vec_b, strength)
            res_orig = compute_resonance(self.vec_a, self.vec_b)
            res_coupled = compute_resonance(A_c, B_c)
            coupling_results[f's={strength}'] = {
                'A_coupled': A_c.tolist(),
                'B_coupled': B_c.tolist(),
                'resonance_original': res_orig,
                'resonance_coupled': res_coupled
            }
            print(f"    s={strength}: resonance {res_orig:.4f} → {res_coupled:.4f}")
        print()
        
        # Lock Condition
        is_locked, stability, status = lock_condition(self.cxl_v1, threshold=0.10)
        print(f"  LockCondition (threshold=0.10): {status}")
        print(f"    Stability Score: {stability:.6f}")
        print()
        
        self.results['operators'] = {
            'crosslink': {
                'v1': self.cxl_v1.tolist(),
                'v2': self.cxl_v2.tolist(),
                'v3_alpha_0.3': self.cxl_v3_03.tolist(),
                'v3_alpha_0.5': self.cxl_v3_05.tolist(),
                'v3_alpha_0.7': self.cxl_v3_07.tolist(),
                'v3_alpha_1.0': self.cxl_v3_10.tolist()
            },
            'mirror': {
                'v1': self.mirror_v1_result.tolist(),
                'v2': self.mirror_v2_result.tolist()
            },
            'phase': phase_results,
            'curvature': curv.tolist(),
            'entropy': entr.tolist(),
            'coupling': coupling_results,
            'lock': {
                'is_locked': is_locked,
                'stability': stability,
                'status': status
            }
        }
        
        # TASK 4: BUILD HEXAGON
        print("TASK 4: BUILD HEXAGON")
        print("-" * 40)
        
        hexagon = build_hexagon(self.vec_a, self.vec_b, self.vec_g, 
                                self.cxl_v1, self.mirror_v1_result)
        
        print("  Nodes:")
        for name, data in hexagon['nodes'].items():
            print(f"    {name} [{data['role']:22}]: mean={data['mean']:.6f}")
        
        print("\n  Edges (Resonance):")
        for edge, strength in hexagon['edges'].items():
            print(f"    {edge}: {strength:.6f}")
        
        print(f"\n  Hexagon Closure: {hexagon['closure']:.6f}")
        print(f"  Coherence: {hexagon['coherence']:.6f}")
        print(f"  Field Energy: {hexagon['field_energy']:.6f}")
        print(f"  Emergent Value: {hexagon['emergent_value']:.6f}")
        print(f"  Emergent Label: {hexagon['emergent_label']}")
        print()
        
        self.results['hexagon'] = hexagon
        
        # TASK 5: RECONSTRUCT MANIFOLD
        print("TASK 5: RECONSTRUCT MANIFOLD")
        print("-" * 40)
        
        for resolution in [10, 20, 40]:
            manifold = reconstruct_manifold(self.vec_a, self.vec_b, self.vec_g, 
                                           resolution=resolution)
            
            print(f"  Resolution = {resolution}:")
            print(f"    Total Points: {manifold['total_points']}")
            print(f"    Centroid: [{', '.join(f'{v:.6f}' for v in manifold['geometry']['centroid'])}]")
            print(f"    Spread: [{', '.join(f'{v:.6f}' for v in manifold['geometry']['spread'])}]")
            print(f"    Volume: {manifold['geometry']['volume']:.6f}")
            print(f"    Entropy Mean: {manifold['geometry']['entropy_mean']:.6f}")
            print()
            
            if resolution == 40:
                self.manifold = manifold
        
        self.results['manifold'] = {
            'geometry': self.manifold['geometry'],
            'resolution': 40,
            'total_points': self.manifold['total_points'],
            'sample_points': self.manifold['points'][:10]  # First 10 for export
        }
        
        # TASK 6: PROJECT TO MANIFOLD
        print("TASK 6: PROJECT TO MANIFOLD")
        print("-" * 40)
        
        target_concepts = [self.target_concept, "harmony", "discord", "balance", "entropy"]
        projection_results = []
        
        for target in target_concepts:
            proj = project_to_manifold(target, self.manifold, 
                                       self.vec_a, self.vec_b, self.cxl_v1)
            projection_results.append(proj)
            
            print(f"  Target: {target}")
            print(f"    Distance: {proj['projection_distance']:.6f}")
            print(f"    Translation Quality: {proj['translation_quality']:.6f}")
            print(f"    Resonance A: {proj['resonance']['with_A']:.6f}")
            print(f"    Resonance B: {proj['resonance']['with_B']:.6f}")
            print(f"    Resonance CXL: {proj['resonance']['with_CXL']:.6f}")
            print()
        
        self.results['projections'] = projection_results
        
        # TASK 7: RUN HARMONIC MODULATION SET
        print("TASK 7: RUN HARMONIC MODULATION SET")
        print("-" * 40)
        
        harmonic_vectors = [
            ('A', self.vec_a),
            ('B', self.vec_b),
            ('CXL', self.cxl_v1),
            ('Mirror', self.mirror_v1_result)
        ]
        
        harmonic_results = {}
        for name, vec in harmonic_vectors:
            # Run at 6 and 41 harmonics
            harm_6 = run_harmonic_analysis(vec, n_harmonics=6)
            harm_41 = run_harmonic_analysis(vec, n_harmonics=41)
            
            print(f"  {name}:")
            print(f"    Base Frequency: {harm_41['base_frequency']:.6f}")
            print(f"    Dominant Harmonic (n=6): H{harm_6['dominant_harmonic']}")
            print(f"    Dominant Harmonic (n=41): H{harm_41['dominant_harmonic']}")
            print(f"    Total Energy (n=41): {harm_41['total_harmonic_energy']:.6f}")
            print()
            
            harmonic_results[name] = {
                'n6': {
                    'dominant': harm_6['dominant_harmonic'],
                    'energy': harm_6['total_harmonic_energy']
                },
                'n41': harm_41
            }
        
        self.results['harmonics'] = harmonic_results
        
        # TASK 8: RUN BATCH MODE
        if self.config['batch_domain_a'] and self.config['batch_domain_b']:
            print("TASK 8: RUN BATCH MODE")
            print("-" * 40)
            
            batch = run_batch_mode(self.config['batch_domain_a'],
                                  self.config['batch_domain_b'],
                                  self.glyph)
            
            print(f"  Domain A: {batch['domain_a']}")
            print(f"  Domain B: {batch['domain_b']}")
            print(f"  Total Pairs: {batch['total_pairs']}")
            print(f"  Emergent Mean: {batch['statistics']['emergent']['mean']:.6f}")
            print(f"  Resonance Mean: {batch['statistics']['resonance']['mean']:.6f}")
            print(f"  Label Distribution: {batch['statistics']['label_distribution']}")
            print()
            
            self.results['batch'] = batch
        
        # Compute resonance matrices
        print("COMPUTING RESONANCE MATRICES")
        print("-" * 40)
        
        all_vectors = {
            'A': self.vec_a,
            'B': self.vec_b,
            'G': self.vec_g,
            'CXL_v1': self.cxl_v1,
            'CXL_v2': self.cxl_v2,
            'Mirror_v1': self.mirror_v1_result,
            'Mirror_v2': self.mirror_v2_result
        }
        
        names = list(all_vectors.keys())
        n = len(names)
        resonance_matrix = np.zeros((n, n))
        
        for i, name_i in enumerate(names):
            for j, name_j in enumerate(names):
                resonance_matrix[i, j] = compute_resonance(
                    all_vectors[name_i], all_vectors[name_j]
                )
        
        print("  Resonance Matrix:")
        header = "        " + "  ".join(f"{n:>8}" for n in names)
        print(header)
        for i, name in enumerate(names):
            row = f"{name:>8}" + "  ".join(f"{resonance_matrix[i,j]:>8.4f}" for j in range(n))
            print(row)
        print()
        
        self.results['resonance_matrix'] = {
            'labels': names,
            'matrix': resonance_matrix.tolist()
        }
        
        # Coherence map
        print("COMPUTING COHERENCE MAP")
        print("-" * 40)
        
        coherence_map = {}
        vector_groups = [
            ('Input', [self.vec_a, self.vec_b]),
            ('Input+Glyph', [self.vec_a, self.vec_b, self.vec_g]),
            ('CrossLink', [self.cxl_v1, self.cxl_v2]),
            ('Mirror', [self.mirror_v1_result, self.mirror_v2_result]),
            ('Full_v1', [self.vec_a, self.vec_b, self.vec_g, self.cxl_v1, self.mirror_v1_result]),
            ('Full_v2', [self.vec_a, self.vec_b, self.vec_g, self.cxl_v2, self.mirror_v2_result])
        ]
        
        for name, vectors in vector_groups:
            coh = compute_coherence(vectors)
            energy = compute_field_energy(vectors)
            coherence_map[name] = {'coherence': coh, 'energy': energy}
            print(f"  {name:15}: coherence={coh:.6f}, energy={energy:.6f}")
        print()
        
        self.results['coherence_map'] = coherence_map
        
        # Stability diagnostics
        print("STABILITY DIAGNOSTICS")
        print("-" * 40)
        
        stability_diagnostics = {}
        for name, vec in all_vectors.items():
            is_locked, stability, status = lock_condition(vec, threshold=0.10)
            variance = float(np.var(vec))
            stability_diagnostics[name] = {
                'variance': variance,
                'stability': stability,
                'is_locked': is_locked,
                'status': status
            }
            print(f"  {name:12}: var={variance:.6f}, stability={stability:.6f}, {status}")
        print()
        
        self.results['stability_diagnostics'] = stability_diagnostics
        
        print("=" * 80)
        print("EXPERIMENT COMPLETE")
        print("=" * 80)
        
        return self.results
    
    def export_json(self, filepath: str):
        """Export full results to JSON"""
        export_data = {
            'config': self.config,
            'results': self.results
        }
        
        with open(filepath, 'w') as f:
            json.dump(export_data, f, indent=2)
        
        print(f"Exported to: {filepath}")
    
    def export_csv(self, filepath: str):
        """Export summary to CSV"""
        rows = []
        
        # Add vector data
        for name, data in self.results.get('primary_vectors', {}).items():
            if 'vector' in data:
                row = {'type': 'primary', 'name': name}
                for i, v in enumerate(data['vector']):
                    row[f'dim_{i}'] = v
                rows.append(row)
        
        # Add operator results
        for op_type, op_data in self.results.get('operators', {}).get('crosslink', {}).items():
            row = {'type': 'crosslink', 'name': op_type}
            for i, v in enumerate(op_data):
                row[f'dim_{i}'] = v
            rows.append(row)
        
        df = pd.DataFrame(rows)
        df.to_csv(filepath, index=False)
        print(f"Exported to: {filepath}")


# ============================================================================
# MAIN EXECUTION
# ============================================================================

if __name__ == "__main__":
    
    # Run experiment with specific parameters
    experiment = SemanticFieldExperiment(
        concept_a="consciousness",
        concept_b="universe",
        glyph="∞",
        target_concept="transcendence",
        batch_domain_a="Identity",
        batch_domain_b="Abstract"
    )
    
    results = experiment.run_full_cascade()
    
    # Export results
    experiment.export_json('/tmp/experiment_v5_full.json')
    experiment.export_csv('/tmp/experiment_v5_summary.csv')
    
    print("\n" + "=" * 80)
    print("ADDITIONAL EXPERIMENTS")
    print("=" * 80)
    
    # Run additional experiment pairs
    additional_experiments = [
        ("light", "shadow", "◐"),
        ("order", "chaos", "⬡"),
        ("self", "other", "◎"),
        ("time", "eternity", "∞"),
        ("creation", "void", "✦")
    ]
    
    additional_results = []
    
    print("\nQUICK COMPARISON TABLE:")
    print("-" * 80)
    print(f"{'Concept A':>12} | {'Concept B':>12} | {'Glyph':>6} | {'Emergent':>10} | {'Label':>12} | {'Coherence':>10}")
    print("-" * 80)
    
    for ca, cb, g in additional_experiments:
        exp = SemanticFieldExperiment(ca, cb, g)
        A = generate_semantic_vector(ca)
        B = generate_semantic_vector(cb)
        G = generate_glyph_vector(g)
        CXL = crosslink_v1(A, B, G)
        M = mirror_v1(CXL)
        emergent = compute_emergent(M)
        label = interpret_emergent(emergent)
        coherence = compute_coherence([A, B, G, CXL, M])
        
        print(f"{ca:>12} | {cb:>12} | {g:>6} | {emergent:>10.6f} | {label:>12} | {coherence:>10.6f}")
        
        additional_results.append({
            'concept_a': ca,
            'concept_b': cb,
            'glyph': g,
            'emergent': emergent,
            'label': label,
            'coherence': coherence
        })
    
    print("-" * 80)
    
    # Save additional results
    with open('/tmp/additional_experiments.json', 'w') as f:
        json.dump(additional_results, f, indent=2)
    
    print("\nAll exports complete!")
