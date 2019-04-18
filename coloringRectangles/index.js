function handleData(ctx) {
	const file = document.getElementById("input-file").files[0];
	const reader = new FileReader();
	reader.readAsText(file);
	(new Promise((res, rej) => {
		reader.onload = (file) => {
			res(file.target.result)
		}
	})).then(render);
}

function render(data) {
	const canvas = document.getElementById("my-canvas");
	canvas.width = canvas.getBoundingClientRect().width;
	canvas.height = canvas.getBoundingClientRect().height;
	const ctx = canvas.getContext('2d');
	let rectsToDraw = []
	const colors = ['rgb(0,255,255)', 'rgb(255,0,255)', 'rgb(255,255,0)', 'rgb(0,0,255)', 'rgb(0,255,0)', 'rgb(255,0,0)'];
	ctx.lineWidth = 1;
	const rects = data.split('\n');
	for (let i = 0; i < rects.length; i++) {
		const coords = rects[i].split(' ');
		const x1 = Number(coords[0]);
		const y1 = Number(coords[1]);
		const dx = Number(coords[2]);
		const dy = Number(coords[3]);
		const curRect = {
			x: x1,
			y: y1,
			dx: dx,
			dy: dy,
			k: 0
		};
		const added = findIntersection(curRect, rectsToDraw);
		rectsToDraw.push(curRect);
		rectsToDraw = rectsToDraw.concat(added);
	}
	rectsToDraw.sort(sortRects);
	for (let i = 0; i < rectsToDraw.length; i++) {
		const rect = rectsToDraw[i];
		ctx.fillStyle = colors[rect.k];
		ctx.fillRect(rect.x, rect.y, rect.dx - rect.x, rect.dy - rect.y);
	}
}

function findIntersection(rect1, rectsToDraw) {
	let {
		x,
		y,
		dx,
		dy
	} = rect1;
	const [x1, y1, dx1, dy1] = [x, y, dx, dy];
	const added = [];
	for (let i = 0; i < rectsToDraw.length; i++) {
		let newRect = {};
		let {
			x,
			y,
			dx,
			dy,
			k
		} = rectsToDraw[i];
		const [xr, yr, dxr, dyr] = [x, y, dx, dy];
		if (x1 <= xr && xr <= dx1 && y1 <= yr && yr <= dy1)
			newRect = {
				x: xr,
				y: yr,
				dx: Math.min(dx1, dxr),
				dy: Math.min(dy1, dyr),
				k: k + 1
			};
		else if (xr < x1 && x1 < dxr && y1 < dyr && yr < dy1)
			newRect = {
				x: x1,
				y: Math.max(y1, yr),
				dx: Math.min(dx1, dxr),
				dy: Math.min(dy1, dyr),
				k: k + 1
			};
		else if (x1 <= xr && xr <= dx1 && yr < y1 && dyr > y1)
			newRect = {
				x: xr,
				y: Math.max(y1, yr),
				dx: Math.min(dx1, dxr),
				dy: Math.min(dy1, dyr),
				k: k + 1
			};

		if ('dx' in newRect)
			added.push(newRect);
	}
	return added;
}

function sortRects(r1, r2) {
	return r1.k - r2.k;
}

(() => {
	const handleDataButton = document.getElementById("handle-data");
	handleDataButton.addEventListener('click', handleData);
})()