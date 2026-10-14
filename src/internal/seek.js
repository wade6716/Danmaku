import { binsearch, resetSpace } from '../utils.js';

/* eslint no-invalid-this: 0 */
export default function() {
  if (!this.media) {
    return this;
  }
  this.clear();
  resetSpace(this._.space);
  if (this._.tracks) {
    this._.tracks = {};
  }
  var position = binsearch(this.comments, 'time', this.media.currentTime);
  this._.position = Math.max(0, position - 1);
  return this;
}
