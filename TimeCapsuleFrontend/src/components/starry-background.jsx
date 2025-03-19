import { useEffect, useRef, useState } from "react"

export default function StarryBackground() {
  const canvasRef = useRef(null)
  const [ripples, setRipples] = useState([])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    let animationFrameId


    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)


    const stars = []
    const starCount = 300

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 0.5,
        baseX: 0, 
        baseY: 0, 
        alpha: Math.random() * 0.8 + 0.2,
        color: getRandomStarColor(),
 
        twinkleSpeed: Math.random() * 0.005 + 0.002, 
        twinklePhase: Math.random() * Math.PI * 2,
      })
    }

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


    function drawBackground() {
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, "#0f0822") // Deep purple
      gradient.addColorStop(0.5, "#1a1245") // Rich purple-blue
      gradient.addColorStop(1, "#0f2342") // Dark blue

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }


    const animate = (timestamp) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      drawBackground()


      const activeRipples = ripples.filter((ripple) => {
        return timestamp - ripple.startTime < ripple.duration
      })

      stars.forEach((star) => {
     
        if (star.baseX === 0) {
          star.baseX = star.x
          star.baseY = star.y
        }

        let newX = star.baseX
        let newY = star.baseY

        activeRipples.forEach((ripple) => {
          const dx = star.baseX - ripple.x
          const dy = star.baseY - ripple.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          const age = timestamp - ripple.startTime
          const rippleProgress = age / ripple.duration

          const maxRadius = ripple.maxRadius * rippleProgress
          if (distance < maxRadius) {
            const wavePosition = distance / 80 - rippleProgress * 5
            
            const amplitude = Math.sin(wavePosition) * ripple.amplitude * (1 - rippleProgress) * 0.2
            
            const angle = Math.atan2(dy, dx)
            newX += Math.cos(angle) * amplitude
            newY += Math.sin(angle) * amplitude
          }
        })

        star.x = star.x + (newX - star.x) * 0.05
        star.y = star.y + (newY - star.y) * 0.05

        star.alpha = 0.2 + 0.6 * (0.5 + 0.5 * Math.sin(timestamp * star.twinkleSpeed + star.twinklePhase))

        ctx.beginPath()

        const glow = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.radius * 4)
        glow.addColorStop(0, `rgba(${star.color}, ${star.alpha})`)
        glow.addColorStop(1, `rgba(${star.color}, 0)`)

        ctx.fillStyle = glow
        ctx.arc(star.x, star.y, star.radius * 4, 0, Math.PI * 2)
        ctx.fill()

        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${star.color}, ${star.alpha})`
        ctx.fill()
      })

      if (ripples.length !== activeRipples.length) {
        setRipples(activeRipples)
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    const handleClick = (e) => {
      const newRipple = {
        x: e.clientX,
        y: e.clientY,
        startTime: performance.now(),
        duration: 3000, 
        amplitude: 15, 
        maxRadius: 300, 
      }

      setRipples((prevRipples) => [...prevRipples, newRipple])
    }

    window.addEventListener("click", handleClick)

    animate(performance.now())


    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
      window.removeEventListener("click", handleClick)
      cancelAnimationFrame(animationFrameId)
    }
  }, [ripples])

  return <canvas ref={canvasRef} className="absolute inset-0 -z-10" />
}