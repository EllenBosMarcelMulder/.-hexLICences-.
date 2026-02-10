# hexOS v0.1
**18-Sector Field Operating System**

*© Marcel Mulder (52%), Ellen Bos (24%), Paola dal Bianco (24%)*  
*LICENTIES: https://github.com/EllenBosMarcelMulder section licences*

## What is hexOS?

hexOS is not an operating system that "runs in a browser."  
**The browser IS the physical projection layer of the OS.**

### Core Principles

1. **No Traditional OS Concepts**
   - No processes (only energy distributions)
   - No scheduler (only field evolution)  
   - No memory management (only conservation)
   - No crashes (only relaxation)

2. **Field Physics as Computing**
   - 18-sector normalized energy field: `ρ[18]` where `Σρ = 1`
   - Local diffusion replaces all process management
   - Conservation law replaces all resource management
   - Stress/integrity observables replace all error handling

3. **Three Components Only**
   - **Kernel** (`kernel.js`): Field evolution (`normalize()`, `evolve()`, `observe()`)
   - **Transducer** (`transducer.js`): Input → field injection
   - **Projector** (`projector.js`): Field state → visual output

## Running hexOS

1. Open `index.html` in any modern browser
2. Click to initialize the field kernel
3. Interact with the field:
   - **Type**: ASCII characters inject energy patterns
   - **Move mouse**: Spatial energy injection
   - **Click**: Random energy impulses

## Architecture

```
Input → Field Evolution → Projection
  ↑           ↓              ↓
Mouse      ρ[18] field    Canvas/SVG
Keyboard   normalize()    Visual output
Camera     evolve()       System status
Touch      observe()      Energy display
```

## Field State

- **Energy Distribution**: `ρ[i]` = energy in sector i
- **Phase**: `φ[i]` = rotational position of sector i  
- **Stress**: Deviation from equilibrium (1/18 per sector)
- **Integrity**: System stability (1.0 = stable, 0.0 = unstable)
- **Coherence**: Spectral organization measure

## Key Insights

1. **Time → Evolution**: No scheduler ticks, only continuous field updates
2. **Objects → Distributions**: Everything is the same entity: normalized vector ρ ∈ ℝ¹⁸
3. **Errors → Observables**: No crashes, only measurable stress/integrity/coherence

## What This Demonstrates

- **Post-application computing**: No traditional software stack
- **Field-based processing**: Mathematics replaces algorithms  
- **Conservation-based resource management**: Physics handles allocation
- **Observable-based monitoring**: Stress/integrity replace error codes

## Development

- **Debug**: `DEBUG_hexOS()` in browser console
- **Reset**: Ctrl+R to reset field kernel
- **Performance**: FPS shown in browser title

---

**This is a complete operating system.**  
**It has no processes, no scheduler, and no memory management.**  
**It works through physics alone.**
