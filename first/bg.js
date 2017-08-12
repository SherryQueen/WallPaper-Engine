(function(window) {

    let ctx, canvasHeight, canvasWidth, maxBubble, bubbles = [],
        lastTime, lastMoveTime, lastMoveTimer, ripples = []

    /**
     * 重置气泡
     * @param {[type]} bubble [气泡对象]
     */
    function resetBubble(bubble) {
        bubble.color = '255, 255, 255'
        bubble.size = random(3, 5)
        bubble.alpha = 0.2 + Math.random() * 0.5
        bubble.posX = random(0, canvasWidth)
        bubble.posY = canvasHeight
        bubble.speed = random(1, 5)
        bubble.dimiss = random(0.5, 2)
        return bubble
    }

    /**
     * 绘制气泡
     * @param  {[type]} bubble [气泡对象]
     * @return {[type]}        [description]
     */
    function drawBubble(bubble) {
        ctx.fillStyle = `rgba(${bubble.color}, ${bubble.alpha})`
        ctx.beginPath()
        ctx.arc(bubble.posX, bubble.posY, bubble.size, Math.PI * 2, false)
        ctx.closePath()
        ctx.fill()
    }

    /**
     * 绘制水波纹
     * @param  {[type]} ripple [水波纹对象]
     * @return {[type]}        [description]
     */
    function drawRipple(ripple) {
        ctx.lineWidth = 0.5

        ripple.radiusArr.map(radius => {
            if (radius >= 56 || radius <= 0) return
            ctx.strokeStyle = `rgba(255,255,255,${1-radius /56})`

            ctx.beginPath()
            ctx.arc(ripple.x, ripple.y, radius, Math.PI * 2, false)
            ctx.closePath()
            ctx.stroke()
        })
    }

    /**
     * 添加一个水波纹
     * @param  {[type]} x [坐标]
     * @param  {[type]} y [坐标]
     * @return {[type]}   [description]
     */
    function newRipple(x, y) {
        const nowTime = Date.now()
        const add = () => {
            const radiusArr = []
            for (let i = 0; i < 3; i++) {
                radiusArr.push(5 - i * 16)
            }
            ripples.push({
                x: x,
                y: y,
                radiusArr: radiusArr
            })
        }

        if (nowTime - lastMoveTime > 300) {
            lastMoveTime = nowTime
            add()
            clearTimeout(lastMoveTimer)
            lastMoveTimer = setTimeout(add, 600)
        } else {
            clearTimeout(lastMoveTimer)
            lastMoveTimer = setTimeout(add, 600)
        }
    }

    function mainLoop() {
        const nowTime = Date.now()
        const times = nowTime - lastTime
        lastTime = nowTime

        ctx.clearRect(0, 0, canvasWidth, canvasHeight)
        bubbles.forEach(bubble => {
            bubble.posY -= bubble.speed * times / 100
            bubble.alpha -= bubble.dimiss * times / 10000
            if (bubble.alpha <= 0) resetBubble(bubble)
            drawBubble(bubble)
        })

        const cnt = times / 50
        ripples.forEach(ripple => {
            for (let i = 0, len = ripple.radiusArr.length; i < len; i++) ripple.radiusArr[i] += cnt
            drawRipple(ripple)
        })
        if (ripples.length > 0 && ripples[0].radiusArr[2] > 56) ripples.shift()

        window.requestAnimationFrame(mainLoop)
    }

    /**
     * 初始化
     * @param  {[type]} canvas [description]
     * @return {[type]}        [description]
     */
    function init(canvas) {
        /** 气泡初始化 **/
        bubbles = []
        lastTime = Date.now()
        for (let i = 0; i < maxBubble; i++) {
            bubbles.push(resetBubble({}))
        }

        /** 水波纹点击事件 **/
        lastMoveTime = lastTime
        canvas.addEventListener('mousemove', e => newRipple(e.clientX, e.clientY), false)
    }

    window.drawBackground = (id, bubble) => {
        maxBubble = bubble
        const canvas = document.getElementById(id)
        if (canvas.getContext) {
            canvasHeight = window.innerHeight
            canvasWidth = window.innerWidth

            canvas.width = canvasWidth
            canvas.height = canvasHeight

            ctx = canvas.getContext('2d')

            init(canvas)
            mainLoop()
        } else {
            alert("HTML5 Canvas isn't supported by your browser!");
        }
    }

})(window)

drawBackground('bg', 200)