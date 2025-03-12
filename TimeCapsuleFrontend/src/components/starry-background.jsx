import { useEffect, useRef, useState } from "react"

export default function StarryBackground() {
  const canvasRef = useRef(null)
  const [ripples, setRipples] = useState([])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    let animationFrameId

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Create stars
    const stars = []
    const starCount = 300

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 0.5,
        baseX: 0, // Will be set in first frame
        baseY: 0, // Will be set in first frame
        alpha: Math.random() * 0.8 + 0.2,
        color: getRandomStarColor(),
        // For twinkling effect
        twinkleSpeed: Math.random() * 0.005 + 0.002, // Reduced for slower twinkle
        twinklePhase: Math.random() * Math.PI * 2,
      })
    }

    // Get random star color (whites, light blues, light purples)
    function getRandomStarColor() {
      const colors = [
        "255, 255, 255", // white
        "220, 220, 255", // light blue
        "230, 210, 255", // light purple
        "255, 230, 210", // light orange
        "210, 230, 255", // light cyan
      ]
      return colors[Math.floor(Math.random() * colors.length)]
    }

    // Draw gradient background
    function drawBackground() {
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, "#0f0822") // Deep purple
      gradient.addColorStop(0.5, "#1a1245") // Rich purple-blue
      gradient.addColorStop(1, "#0f2342") // Dark blue

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    // Animation function
    const animate = (timestamp) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      drawBackground()

      // Update ripples
      const activeRipples = ripples.filter((ripple) => {
        return timestamp - ripple.startTime < ripple.duration
      })

      // Draw and update stars
      stars.forEach((star) => {
        // Set base position on first frame if not set
        if (star.baseX === 0) {
          star.baseX = star.x
          star.baseY = star.y
        }

        // Reset position to base
        let newX = star.baseX
        let newY = star.baseY

        // Apply all active ripple effects
        activeRipples.forEach((ripple) => {
          const dx = star.baseX - ripple.x
          const dy = star.baseY - ripple.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          // Calculate ripple effect
          const age = timestamp - ripple.startTime
          const rippleProgress = age / ripple.duration

          // Only affect stars within the ripple radius
          const maxRadius = ripple.maxRadius * rippleProgress
          if (distance < maxRadius) {
            // Calculate wave amplitude based on distance from ripple center
            const wavePosition = distance / 80 - rippleProgress * 5
            
            // Significantly reduced amplitude to make stars move less
            const amplitude = Math.sin(wavePosition) * ripple.amplitude * (1 - rippleProgress) * 0.2
            
            // Apply displacement along the radius
            const angle = Math.atan2(dy, dx)
            newX += Math.cos(angle) * amplitude
            newY += Math.sin(angle) * amplitude
          }
        })

        // Update star position with much smoother transition (lerping)
        star.x = star.x + (newX - star.x) * 0.05
        star.y = star.y + (newY - star.y) * 0.05

        // Twinkle effect using sine wave - made slower
        star.alpha = 0.2 + 0.6 * (0.5 + 0.5 * Math.sin(timestamp * star.twinkleSpeed + star.twinklePhase))

        // Draw star with glow effect
        ctx.beginPath()

        // Create glow
        const glow = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.radius * 4)
        glow.addColorStop(0, `rgba(${star.color}, ${star.alpha})`)
        glow.addColorStop(1, `rgba(${star.color}, 0)`)

        ctx.fillStyle = glow
        ctx.arc(star.x, star.y, star.radius * 4, 0, Math.PI * 2)
        ctx.fill()

        // Draw star center
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${star.color}, ${star.alpha})`
        ctx.fill()
      })

      // Update ripples state if needed
      if (ripples.length !== activeRipples.length) {
        setRipples(activeRipples)
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    // Create ripple on click
    const handleClick = (e) => {
      const newRipple = {
        x: e.clientX,
        y: e.clientY,
        startTime: performance.now(),
        duration: 3000, // 3 seconds
        amplitude: 15, // Reduced amplitude for clicks
        maxRadius: 300, // Larger radius for clicks
      }

      setRipples((prevRipples) => [...prevRipples, newRipple])
    }

    window.addEventListener("click", handleClick)

    animate(performance.now())

    // Cleanup
    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
      window.removeEventListener("click", handleClick)
      cancelAnimationFrame(animationFrameId)
    }
  }, [ripples])

  return <canvas ref={canvasRef} className="absolute inset-0 -z-10" />
}