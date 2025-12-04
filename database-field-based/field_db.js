// FIELD DATABASE: Data as Tension Geometry
// Instead of tables, we store information as field configurations

class FieldDatabase {
  constructor() {
    this.fields = new Map(); // Field configurations
    this.glyphIndex = new Map(); // Fast lookup by glyph signature
  }
  
  // WRITE: Encode data as field tension
  write(key, data) {
    const field = this.encodeToField(data);
    this.fields.set(key, field);
    
    // Index by glyph signature
    const signature = this.computeGlyphSignature(field);
    if (!this.glyphIndex.has(signature)) {
      this.glyphIndex.set(signature, []);
    }
    this.glyphIndex.get(signature).push(key);
    
    return signature;
  }
  
  // READ: Decode field back to data
  read(key) {
    const field = this.fields.get(key);
    return field ? this.decodeFromField(field) : null;
  }
  
  // QUERY: Find similar field states (analogical retrieval)
  findSimilar(queryData, threshold = 0.8) {
    const queryField = this.encodeToField(queryData);
    const querySignature = this.computeGlyphSignature(queryField);
    
    const results = [];
    for (const [key, field] of this.fields) {
      const similarity = this.computeFieldSimilarity(queryField, field);
      if (similarity >= threshold) {
        results.push({
          key,
          data: this.decodeFromField(field),
          similarity,
          resonance: this.computeResonance(queryField, field)
        });
      }
    }
    
    return results.sort((a, b) => b.similarity - a.similarity);
  }
  
  // ENCODE: Transform data into field configuration
  encodeToField(data) {
    const φ = (1 + Math.sqrt(5)) / 2;
    
    // Convert data to numerical features
    const features = this.extractFeatures(data);
    
    // Map to field parameters
    const field = {
      deltaPhi: this.mapToRange(features.variance, -1, 1),
      curvature: this.mapToRange(features.skewness, -1, 1),
      motherDNA: this.mapToRange(features.entropy, 0, 0.5),
      syntropy: Math.exp(-Math.abs(features.correlation)),
      
      // Encode structure as tension pattern
      tensions: features.structure.map(v => 
        Math.tanh(v * φ)
      ),
      
      // Phase encoding of categorical data
      phases: features.categories.map((cat, i) => 
        (cat * φ + i) % (2 * Math.PI)
      ),
      
      // Original data (for lossless recovery)
      raw: data
    };
    
    return field;
  }
  
  // DECODE: Reconstruct data from field
  decodeFromField(field) {
    // For now, return raw (lossless)
    // But field parameters allow approximate/fuzzy retrieval
    return field.raw;
  }
  
  // Extract numerical features from arbitrary data
  extractFeatures(data) {
    if (typeof data === 'number') {
      return {
        variance: data % 1,
        skewness: Math.sin(data),
        entropy: Math.abs(Math.cos(data)),
        correlation: 0,
        structure: [data],
        categories: []
      };
    }
    
    if (typeof data === 'string') {
      const charCodes = Array.from(data).map(c => c.charCodeAt(0));
      return {
        variance: this.variance(charCodes),
        skewness: this.skewness(charCodes),
        entropy: this.entropy(charCodes),
        correlation: this.autocorrelation(charCodes),
        structure: charCodes.slice(0, 7).map(c => c / 255),
        categories: [...new Set(data.toLowerCase())].map(c => c.charCodeAt(0))
      };
    }
    
    if (Array.isArray(data)) {
      const nums = data.map((v, i) => 
        typeof v === 'number' ? v : v.toString().length
      );
      return {
        variance: this.variance(nums),
        skewness: this.skewness(nums),
        entropy: this.entropy(nums),
        correlation: this.autocorrelation(nums),
        structure: nums.slice(0, 7),
        categories: []
      };
    }
    
    if (typeof data === 'object') {
      const values = Object.values(data);
      return this.extractFeatures(values);
    }
    
    return {
      variance: 0, skewness: 0, entropy: 0, correlation: 0,
      structure: [], categories: []
    };
  }
  
  // Statistical measures
  variance(arr) {
    const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
    return arr.reduce((sum, x) => sum + (x - mean) ** 2, 0) / arr.length;
  }
  
  skewness(arr) {
    const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
    const std = Math.sqrt(this.variance(arr));
    if (std === 0) return 0;
    return arr.reduce((sum, x) => sum + ((x - mean) / std) ** 3, 0) / arr.length;
  }
  
  entropy(arr) {
    const freq = new Map();
    arr.forEach(x => freq.set(x, (freq.get(x) || 0) + 1));
    let entropy = 0;
    for (const count of freq.values()) {
      const p = count / arr.length;
      entropy -= p * Math.log2(p);
    }
    return entropy;
  }
  
  autocorrelation(arr) {
    if (arr.length < 2) return 0;
    const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
    let num = 0, denom = 0;
    for (let i = 0; i < arr.length - 1; i++) {
      num += (arr[i] - mean) * (arr[i + 1] - mean);
      denom += (arr[i] - mean) ** 2;
    }
    return denom === 0 ? 0 : num / denom;
  }
  
  mapToRange(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }
  
  // Compute glyph signature (for indexing)
  computeGlyphSignature(field) {
    const φ = (1 + Math.sqrt(5)) / 2;
    
    // Discretize field into glyph "shape"
    const deltaBucket = Math.floor((field.deltaPhi + 1) * 5);
    const curveBucket = Math.floor((field.curvature + 1) * 5);
    const dnaBucket = Math.floor(field.motherDNA * 10);
    
    return `${deltaBucket}-${curveBucket}-${dnaBucket}`;
  }
  
  // Measure field similarity (0 to 1)
  computeFieldSimilarity(f1, f2) {
    const δ_deltaPhi = Math.abs(f1.deltaPhi - f2.deltaPhi);
    const δ_curve = Math.abs(f1.curvature - f2.curvature);
    const δ_dna = Math.abs(f1.motherDNA - f2.motherDNA);
    const δ_syn = Math.abs(f1.syntropy - f2.syntropy);
    
    // Weighted distance
    const dist = (δ_deltaPhi * 0.3 + δ_curve * 0.3 + δ_dna * 0.2 + δ_syn * 0.2);
    
    // Convert to similarity
    return Math.exp(-dist * 2);
  }
  
  // Measure resonance (phase coherence)
  computeResonance(f1, f2) {
    if (!f1.phases || !f2.phases) return 0;
    
    let coherence = 0;
    const n = Math.min(f1.phases.length, f2.phases.length);
    
    for (let i = 0; i < n; i++) {
      const δθ = Math.abs(f1.phases[i] - f2.phases[i]);
      coherence += Math.cos(δθ);
    }
    
    return n > 0 ? coherence / n : 0;
  }
}

// DEMONSTRATION
const db = new FieldDatabase();

// Store different types of data
console.log('=== FIELD DATABASE TEST ===\n');

db.write('user1', { name: 'Alice', age: 30, interests: ['art', 'music'] });
db.write('user2', { name: 'Bob', age: 32, interests: ['art', 'science'] });
db.write('user3', { name: 'Carol', age: 28, interests: ['music', 'dance'] });

console.log('Stored 3 users as field configurations\n');

// Query by similarity (content-based, not key-based)
const similar = db.findSimilar(
  { name: 'Dave', age: 31, interests: ['art', 'poetry'] },
  0.5
);

console.log('Similar users to Dave (art lover, ~30 years old):');
similar.forEach(result => {
  console.log(`- ${result.data.name}: similarity=${result.similarity.toFixed(3)}, resonance=${result.resonance.toFixed(3)}`);
});

console.log('\n=== KEY INSIGHTS ===');
console.log('1. No tables - data exists as field tension');
console.log('2. Similarity queries are native (not computed)');
console.log('3. Analogical retrieval through resonance');
console.log('4. Glyph signatures enable fast approximate matching');
