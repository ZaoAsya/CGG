(function() {
    const GLOBAL_CHART_OPTIONS = {
        canvas: null,
        container: null,
        ctx: null,
        startX: -10,
        cellSize: 5,
        endX: 10,
        axisColor: '#000',
        graphColor: '#f55'
    }

    initListeners();
    updateOptions();
    render(GLOBAL_CHART_OPTIONS.startX, GLOBAL_CHART_OPTIONS.endX);


    function initListeners(argument) {

        function onApply() {
            const inpX1 = document.getElementById('start-point');
            const inpX2 = document.getElementById('end-point');

            const start = Number(inpX1.value);
            const end = Number(inpX2.value);

            render(start, end);
        }

        const apply = document.getElementById('apply-button');

        apply.addEventListener('click', onApply);
        window.addEventListener('resize', onApply, true);
    }

    function updateOptions() {
        GLOBAL_CHART_OPTIONS.container = document.querySelector('.chart-container');
        GLOBAL_CHART_OPTIONS.canvas = document.getElementById('chart-element');
        GLOBAL_CHART_OPTIONS.ctx = GLOBAL_CHART_OPTIONS.canvas.getContext("2d");
    }

    function render(start, end) {
        setCanvasSize()
        drawGraph(start, end);
    }

    function setCanvasSize() {
        const {
            canvas,
            container,
        } = GLOBAL_CHART_OPTIONS;
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight
    }

    function drawAxis(x1, y1, x2, y2) {
        const {
            ctx,
            graphColor,
            axisColor
        } = GLOBAL_CHART_OPTIONS;
        ctx.stroke();
        ctx.beginPath()
        ctx.strokeStyle = axisColor;
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = graphColor;
    }

    function drawGraph(start, end) {
        const {
            canvas,
            ctx,
            graphColor,
            axisColor
        } = GLOBAL_CHART_OPTIONS;
        let ymin = f(start);
        let ymax = ymin;
        ctx.beginPath();
        let drawnAxisX = false;
        let drawnAxisY = false;
        let oldX = 0;
        ctx.strokeStyle = graphColor;
        for (let xx = 0; xx < canvas.width; xx++) {
            let x = start + xx * (end - start) / canvas.width;
            let y = f(x);
            console.log(x, y)
            if (x == 0) {
                drawAxis(xx, 0, xx, canvas.height);
                drawnAxisX = true;
            } else if (!drawnAxisX && oldX < 0 && x > 0) {
                drawAxis(xx, 0, xx, canvas.height);
                drawnAxisX = true;
            }
            if (y < ymin) ymin = y;
            if (y > ymax) ymax = y;
            oldX = x;
        }
        let yy = (f(start) - ymin) * canvas.height / (ymax - ymin);
        ctx.moveTo(0, yy);
        let oldy = 0;
        let olddy = 0;
        for (let xx = 0; xx < canvas.width; xx++) {
            x = start + xx * (end - start) / canvas.width;
            y = f(x);
            yy = (y - ymax) * canvas.height / (ymin - ymax);
            if (!drawnAxisY && y === 0) {
                drawAxis(0, yy, canvas.width, yy);
                drawnAxisY = true;
                ctx.moveTo(xx - 1, oldy);
            } else if (!drawnAxisY && (Math.round(y * 100) / 100 === 0 || (olddy < 0 && y > 0 && Math.floor(y) === 0) || (olddy > 0 && y < 0 && Math.ceil(y) === 0))) {
                drawAxis(0, yy, canvas.width, yy);
                drawnAxisY = true;
                ctx.moveTo(xx - 1, oldy);
            }
            if (xx == 0) {
                ctx.moveTo(xx, yy)
            } else {
                ctx.lineTo(xx, yy);
            }
            olddy = y;
            oldy = yy;
        }
        ctx.stroke();
    }

    function f(x) {
        return x * Math.sin(x * x);
    }

})()