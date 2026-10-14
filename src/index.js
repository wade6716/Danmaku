import init from './api/init.js';
import destroy from './api/destroy.js';
import emit from './api/emit.js';
import show from './api/show.js';
import hide from './api/hide.js';
import clear from './api/clear.js';
import resize from './api/resize.js';
import speed from './api/speed.js';
import seek from './internal/seek.js';

function Danmaku(opt) {
  opt && init.call(this, opt);
}
Danmaku.prototype.destroy = function() {
  return destroy.call(this);
};
Danmaku.prototype.emit = function(cmt) {
  return emit.call(this, cmt);
};
Danmaku.prototype.show = function() {
  return show.call(this);
};
Danmaku.prototype.hide = function() {
  return hide.call(this);
};
Danmaku.prototype.clear = function() {
  return clear.call(this);
};
Danmaku.prototype.resize = function() {
  return resize.call(this);
};
Danmaku.prototype.seek = function() {
  return seek.call(this);
};

Object.defineProperty(Danmaku.prototype, 'speed', speed);

Object.defineProperty(Danmaku.prototype, 'area', {
  get: function() {
    return this._ ? this._.area : 1.0;
  },
  set: function(val) {
    if (this._ && typeof val === 'number') {
      this._.area = Math.min(1.0, Math.max(0.1, val));
      if (this._.tracks) this._.tracks = {};
      this.resize();
    }
  }
});

Object.defineProperty(Danmaku.prototype, 'bottomMargin', {
  get: function() {
    return this._ ? this._.bottomMargin : 48;
  },
  set: function(val) {
    if (this._ && typeof val === 'number') {
      this._.bottomMargin = Math.max(0, val);
      if (this._.tracks) this._.tracks = {};
      this.resize();
    }
  }
});

Object.defineProperty(Danmaku.prototype, 'opacity', {
  get: function() {
    return this._ ? this._.opacity : 1.0;
  },
  set: function(val) {
    if (this._ && typeof val === 'number') {
      this._.opacity = Math.min(1.0, Math.max(0.0, val));
    }
  }
});

Object.defineProperty(Danmaku.prototype, 'offset', {
  get: function() {
    return this._ ? this._.offset : 0;
  },
  set: function(val) {
    if (this._ && typeof val === 'number') {
      this._.offset = val;
      this.seek();
    }
  }
});

Object.defineProperty(Danmaku.prototype, 'maxLines', {
  get: function() {
    return this._ ? this._.maxLines : 0;
  },
  set: function(val) {
    if (this._ && typeof val === 'number') {
      this._.maxLines = Math.max(0, Math.floor(val));
      if (this._.tracks) this._.tracks = {};
      this.resize();
    }
  }
});

export default Danmaku;
