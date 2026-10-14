import { now } from '../utils.js';

/* eslint no-invalid-this: 0 */
export default function(cmt) {
  var that = this;
  var mode = cmt.mode || 'rtl';
  var ct = this.media ? this.media.currentTime : now() / 1000;

  // 单行基准高度（字号加上合理的行间距与上下 padding）
  var fontHeight = cmt.height || 28;
  var trackHeight = Math.ceil(fontHeight * 1.25);
  if (trackHeight < 24) {
    trackHeight = 24;
  }

  var area = typeof this._.area === 'number' ? Math.min(1.0, Math.max(0.1, this._.area)) : 1.0;
  var bottomMargin = typeof this._.bottomMargin === 'number' ? Math.max(0, this._.bottomMargin) : 48;

  // 计算当前容器高度下避开底部字幕区后的可用高度
  var usableHeight = Math.max(trackHeight, this._.height - bottomMargin);
  var maxValidHeight = Math.max(trackHeight, usableHeight * area);

  // 计算当前区域限制下能容纳的严格整数轨道总数（杜绝上下行半截重叠）
  var maxTracks = Math.max(1, Math.floor(maxValidHeight / trackHeight));
  if (typeof this._.maxLines === 'number' && this._.maxLines > 0) {
    maxTracks = Math.min(maxTracks, this._.maxLines);
  }

  if (!this._.tracks) {
    this._.tracks = {};
  }
  if (!this._.tracks[mode] || this._.tracks[mode].length !== maxTracks) {
    var old = this._.tracks[mode] || [];
    this._.tracks[mode] = [];
    for (var k = 0; k < maxTracks; k++) {
      this._.tracks[mode][k] = old[k] || null;
    }
  }

  var safeGap = 24; // 24px 入场安全车距

  // B 站时空双重防撞断言：检测后车 cmt 与前车 last 在同一轨道上是否会碰撞
  function willCollide(last, cmt) {
    if (mode === 'top' || mode === 'bottom') {
      return ct - last.time < that._.duration;
    }
    // 统一同屏时间模型：前车走完全程耗时 duration，位移与时间成正比
    var lastTotalWidth = that._.width + last.width;
    var lastElapsed = lastTotalWidth * (ct - last.time) / that._.duration;

    // 1. 入场安全断言：后车入场时，前车尾部必须已完全进入屏幕右侧，且留出 safeGap
    if (lastElapsed < last.width + safeGap) {
      return true; // 入场碰撞
    }

    // 2. 途中追尾预测：若后车文本较长，其滑行速度比前车快，需预测中途是否会超车追尾
    if (cmt.width > last.width) {
      var lastRemainingTime = that._.duration - (ct - last.time); // 前车离屏剩余时间
      var catchDistance = lastElapsed - (last.width + safeGap); // 当前车距
      var relativeSpeed = (cmt.width - last.width) / that._.duration; // 相对速度 (px/s)
      var catchTime = catchDistance / relativeSpeed; // 追上所需时间
      if (catchTime < lastRemainingTime) {
        return true; // 屏幕内部中途必定追尾
      }
    }

    return false; // 安全可用
  }

  var chosenTrack = -1;
  for (var i = 0; i < maxTracks; i++) {
    var lastCmt = this._.tracks[mode][i];
    if (!lastCmt || !willCollide(lastCmt, cmt)) {
      chosenTrack = i;
      break;
    }
  }

  // 饱和拦截：若所有可用轨道均会追尾或满载，直接丢弃该弹幕（B站防重叠硬拦截）
  if (chosenTrack === -1) {
    return -1;
  }

  this._.tracks[mode][chosenTrack] = {
    time: ct,
    width: cmt.width,
    height: cmt.height
  };

  // 严格网格对齐计算 Y 轴坐标
  if (mode === 'bottom') {
    // 底部弹幕：从避让字幕线 (this._.height - bottomMargin) 向上堆叠
    return this._.height - bottomMargin - trackHeight - chosenTrack * trackHeight;
  }
  return chosenTrack * trackHeight;
}
