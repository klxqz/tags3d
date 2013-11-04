/**
 * Copyright (C) 2010 Graham Breach
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 * 
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
/**
 * TagCanvas 1.1.1
 * For more information, please contact <graham@goat1000.com>
 */
function Point(x,y)
{
	this.x = x; this.y = y;
}
Point.AbsPos = function(id)
{
	var e, p, pn;
	e = document.getElementById(id);
	p = new Point(e.offsetLeft,e.offsetTop);
	while(e.offsetParent) {
		pn = e.offsetParent;
		p.x += pn.offsetLeft;
		p.y += pn.offsetTop;
		e = pn;
	}
	return p;
};
function Point3D(x,y,z)
{
	this.x = x; this.y = y; this.z = z;
	this.RotateX = function(t) {
		var s, c, p; 
		s = Math.sin(t);
		c = Math.cos(t);
		p = new Point3D(
			this.x,
			(this.y * c) + (this.z * s),
			(this.y * -s) + (this.z * c));
		return p;
	};
	this.RotateY = function(t) {
		var s, c, p;
		s = Math.sin(t);
		c = Math.cos(t);
		p = new Point3D(
			(this.x * c) + (this.z * -s),
			this.y,
			(this.x * s) + (this.z * c));
		return p;
	};
	this.RotateZ = function(t) {
		var s, c, p;
		s = Math.sin(t);
		c = Math.cos(t);
		p = new Point3D(
			(this.x * c) + (this.y * s),
			(this.x * -s) + (this.y * c),
			this.z);
		return p;
	};
	this.toString = function() {
		return '[' + this.x.toFixed(2) + ',' + this.y.toFixed(2) + ',' + this.z.toFixed(2) + ']';
	};
	this.Project = function(w,h,fov,asp) {
		var yn, xn, zn;
		yn = (this.y  * TagCanvas.z1) / (TagCanvas.z1 + TagCanvas.z2 + this.z);
		xn = (this.x  * TagCanvas.z1) / (TagCanvas.z1 + TagCanvas.z2 + this.z);
		zn = TagCanvas.z2 + this.z;
		return new Point3D(xn, yn, zn);
	};
}
function TagCanvas(cid)
{
	var i, ctr, tl, vl, p, c = document.getElementById(cid), cp = ['id','class','innerHTML'];
	if(c && !c.getContext('2d').fillText) {
		p = document.createElement('DIV');
		for(i = 0; i < cp.length; ++i)
			p[cp[i]] = c[cp[i]];
		c.parentNode.insertBefore(p,c);
		c.parentNode.removeChild(c);
		throw 0;
	}
	TagCanvas.z1 = (19800 / (Math.exp(TagCanvas.depth) * (1-1/Math.E))) +
		20000 - 19800 / (1-(1/Math.E));
	TagCanvas.z2 = TagCanvas.z1;
	TagCanvas.radius = (c.height > c.width ? c.width : c.height)
				* 0.33 * (TagCanvas.z2 + TagCanvas.z1) / (TagCanvas.z1);
	this.Draw = function(cv)
	{
		var active_scale = 0, x1, y1, c, a, i;
		c = cv.getContext('2d');
		c.clearRect(0,0,cv.width,cv.height);
		c.strokeStyle = 'white';
		c.fillStyle = 'white';
		this.Animate(cv.width, cv.height);
		x1 = cv.width / 2;
		y1 = cv.height / 2;
		this.active = null;
		this.active_index = null;
		for(i = 0; i < this.taglist.length; ++i)
		{
			a = this.taglist[i].Draw(c, x1, y1, this.yaw, this.pitch);
			if(a && a.sc > active_scale)
			{
				this.active = a;
				this.active_index = i;
				active_scale = a.sc;
			}
		}
		if(this.active)
			this.active.Draw(c);
	};
	this.Animate = function(w,h)
	{
		if(TagCanvas.mx >= 0 && TagCanvas.my >= 0 &&
				TagCanvas.mx < w && TagCanvas.my < h)
		{
			// by derflash (-1 *  >>> inverts yaw/pitch)
			this.yaw = -1 * ((TagCanvas.maxSpeed * 2 * TagCanvas.mx / w) - TagCanvas.maxSpeed);
			this.pitch = -1 * (-((TagCanvas.maxSpeed * 2 * TagCanvas.my / h) - TagCanvas.maxSpeed));
		}
		else
		{
			this.yaw = this.yaw * TagCanvas.decel;
			this.pitch = this.pitch * TagCanvas.decel;
		}
	};	
	this.Clicked = function(e)
	{
		try {
			if(this.taglist[this.active_index]) 
				this.taglist[this.active_index].Clicked(e);
		} catch(ex) {
			//window.alert(ex);
		}
	};
	try {
		ctr = document.getElementById(cid);
		tl = ctr.getElementsByTagName('A');
		this.taglist = [];
		if(tl.length)
		{
			vl = TagCanvas.PointsOnSphere(tl.length,i);
			for(i = 0; i < tl.length; ++i)
			{
				this.taglist.push(new Tag(tl[i].textContent, tl[i].href, tl[i].target,
					vl[i], 10, TagCanvas.textHeight));
			}
		}
	} catch(ex) {
		// ex;
	}

	this.yaw = 0;
	this.pitch = 0;
	p = Point.AbsPos(c.id);
	TagCanvas.cx = p.x;
	TagCanvas.cy = p.y;
	setInterval(function() { TagCanvas.DrawCanvas(c); }, 10);
	document.addEventListener('mousemove', TagCanvas.MouseMove, false);
	document.addEventListener('mouseout', TagCanvas.MouseMove, false);
	// by derflash
	document.addEventListener('mouseover', function() {
		p = Point.AbsPos(c.id);
		TagCanvas.cx = p.x;
		TagCanvas.cy = p.y;
	}, false);
	document.addEventListener('mousemove', function() {
		p = Point.AbsPos(c.id);
		TagCanvas.cx = p.x;
		TagCanvas.cy = p.y;
	}, false);

	document.addEventListener('mousedown', TagCanvas.MouseClick, false);
}
function Outline(x,y,w,h,sc)
{
	this.x = x; this.y = y;
	this.w = w; this.h = h;
	this.sc = sc;
	this.Draw = function(c) {
		c.save();
		c.scale(this.sc, this.sc);
		c.strokeStyle = TagCanvas.outlineColour;
		c.lineWidth = TagCanvas.outlineThickness;
		c.beginPath();
		c.rect(this.x-TagCanvas.outlineOffset, this.y-TagCanvas.outlineOffset,
			this.w+TagCanvas.outlineOffset*2, this.h+TagCanvas.outlineOffset*2);
		c.closePath();
		c.stroke();
		c.restore();
	};
}
function Tag(name,href,target,v,w,h)
{
	this.name = name;
	this.href = href;
	this.target = target;
	this.p3d = new Point3D;
	this.p3d.x = v[0] * TagCanvas.radius * 1.1;
	this.p3d.y = v[1] * TagCanvas.radius * 1.1;
	this.p3d.z = v[2] * TagCanvas.radius * 1.1;
	this.x = 0;
	this.y = 0;
	this.w = w;
	this.h = h;
	this.sc = 1;
	this.alpha = 1;

	this.Draw = function(c,xoff,yoff,yaw,pitch) {
		var active = 0, m;
		this.Calc(yaw,pitch);
		c.save();
		c.globalAlpha = this.alpha;
		c.scale(this.sc, this.sc);
		c.textBaseline = 'top';
		c.fillStyle = TagCanvas.textColour;
		c.font = TagCanvas.textHeight + 'px ' + TagCanvas.textFont;
		m = c.measureText(this.name);
		this.w = ((m.width + 2) * this.sc);
		this.h1 = this.h * this.sc;
		xoff = (xoff - this.w / 2) / this.sc;
		yoff = (yoff - this.h1 / 2) / this.sc;
		this.w = m.width + 2;
		this.h1 = this.h + 2;

		c.fillText(this.name, xoff + this.x + 1, yoff + this.y + 1, this.w - 2);
		c.beginPath();
		c.rect(xoff + this.x, yoff + this.y, this.w, this.h1);
		c.closePath();
		c.restore();
		if(c.isPointInPath(TagCanvas.mx, TagCanvas.my))
		{
			c.save();
			c.globalAlpha = this.alpha;
			c.restore();
			active = new Outline(xoff + this.x, yoff + this.y, this.w, this.h1, this.sc);
		}
		return active;
	};
	this.Calc = function(yaw,pitch) {
		var p;
		p = this.p3d.RotateY(yaw);
		this.p3d = p.RotateX(pitch);

		p = this.p3d.Project(this.w, this.h, Math.PI / 4, 20);
		this.x = p.x;
		this.y = p.y;
		this.sc = (TagCanvas.z1 + TagCanvas.z2 - p.z) / TagCanvas.z2;
		this.alpha = TagCanvas.minBrightness + 1 -
			((p.z - TagCanvas.z2 + TagCanvas.radius) / (2 * TagCanvas.radius));
	};
	this.Clicked = function(e) {
		if(this.target == '' || this.target == '_self')
			document.location = this.href;
		else if(self.frames[this.target])
			self.frames[this.target] = this.href;
		else if(top.frames[this.target])
			top.frames[this.target] = this.href;
		else
			window.open(this.href, this.target);
	};
}
TagCanvas.MouseMove = function(e)
{
	TagCanvas.mx = e.pageX - TagCanvas.cx;
	TagCanvas.my = e.pageY - TagCanvas.cy;
};
TagCanvas.MouseClick = function(e)
{
	TagCanvas.MouseMove(e);
	TagCanvas.tc.Clicked(e);
};
TagCanvas.DrawCanvas = function(cv)
{
	TagCanvas.tc.Draw(cv);
};
TagCanvas.Start = function(id)
{
	TagCanvas.tc = new TagCanvas(id);
};
TagCanvas.PointsOnSphere = function(n)
{
	var i, y, r, phi, pts = [], inc = Math.PI * (3-Math.sqrt(5)), off = 2/n;
	for(i = 0; i < n; ++i) {
		y = i * off - 1 + (off / 2);
		r = Math.sqrt(1 - y*y);
		phi = i * inc;
		pts.push([Math.cos(phi)*r, y, Math.sin(phi)*r]);
	}
	return pts;
};


TagCanvas.mx = -1;
TagCanvas.my = -1;
TagCanvas.cx = 0;
TagCanvas.cy = 0;
TagCanvas.z1 = 20000;
TagCanvas.z2 = 20000;
TagCanvas.depth = 0.5;
TagCanvas.maxSpeed = 0.05;
TagCanvas.decel = 0.95;
TagCanvas.minBrightness = 0.1;
TagCanvas.outlineColour = '#ffff99';
TagCanvas.outlineThickness = 2;
TagCanvas.outlineOffset = 5;
TagCanvas.textColour = '#ff99ff';
TagCanvas.textHeight = 15;
TagCanvas.textFont = 'Helvetica, Arial, sans-serif';

