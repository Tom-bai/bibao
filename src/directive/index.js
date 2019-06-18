import i18n from 'vue-i18n';
import Vue from 'vue';
// letterfx
const letterfx = Vue.directive('letterfx', {
  inserted: (el, binding, vnode) => {
    let arrText = el.innerText.split('');
    let str = '';
    arrText.map((item, key) => {
      str = str + `<span>${item}</span>`;
    });
    el.innerHTML = str;
  }
});
// 打字效果
const typing = Vue.directive('typing', {
  inserted: (el, binding, vnode) => {
    let _value = binding.value;
    let i = 0;
    function setTyping() {
      if (i < _value.length) {
        el.innerHTML = _value.slice(0, i++) + ' |';
        setTimeout(() => {
          setTyping();
        }, 100); // 递归调用
      } else {
        el.innerHTML = _value;
      }
    }
    setTyping();
  }
});
// 聚焦元素
const focus = Vue.directive('focus', {
  inserted: (el) => {
    el.focus();
  }
});
const blur = Vue.directive('blur', {
  inserted: (el) => {
    document.body.onclick = function(event) {
      console.log(el);
      console.log(event.target);
      if (event.target != el) {
        console.log(111);
        el.blur();
      };
    };
  }
});
// 提示
const tip = Vue.directive('tip', {
  inserted: (el, binding, vnode) => {
    let _value = binding.value?binding.value: i18n.t('NO_DATA');
    let offsetLeft = el.offsetLeft;
    let _appendEl = document.createElement('div');
    let _dir = '';
    for (let item in binding.modifiers) {
      _dir = item;
    }
    _dir = _dir ? _dir : 'right';
    _appendEl.className = `directive_tip ${_dir}`;
    _appendEl.innerHTML = _value;
    el.style = 'cursor:pointer;position:relative';
    el.onmouseover = (event) => {
      if (document.body._appendEl) {
        return false;
      }
      let _pos = getPosition(el);
      let _h = el.offsetHeight;
      let _w = el.offsetWidth;
      document.body.appendChild(_appendEl);
      _appendEl.style.cssText = getStyle(_dir, _w, _h, _pos, _appendEl);
    };
    el.onmouseout = (events) => {
      document.body.removeChild(_appendEl);
    };
  },
  // 数据更新时重新调用
  update:(el, binding, vnode)=>{
    this.a.tip.inserted(el, binding, vnode)
  }
});
/**
 * 获取dom 到浏览器周边的垂直距离
 * @param {*} obj 
 */
function getPosition(obj) {
  var l = 0;
  var t = 0;
  var _el = obj;
  while (obj) {
    l += obj.offsetLeft - obj.scrollLeft;
    t += obj.offsetTop - obj.scrollTop;
    obj = obj.offsetParent;
  }
  return { left: l, top: t, right: l + _el.offsetWidth, bottom: t + _el.offsetHeight };
}
function getStyle(_dir, _w, _h, _pos, _appendEl) {
  switch (_dir) {
    case 'top':
      // return `left:${_pos.right - _w / 2 - _appendEl.offsetWidth / 2}px;top:${_pos.top - _appendEl.offsetHeight - 8}px;`;
      return `left:${_pos.right - _w}px;top:${_pos.top - _appendEl.offsetHeight - 8}px;`;
      break;
    case 'bottom':
      // return `left:${_pos.right - _w / 2 - _appendEl.offsetWidth / 2}px;top:${_pos.top + _h + 15}px;`;
      return `left:${_pos.right - _w}px;top:${_pos.top + _h + 15}px;`;
      break;
    case 'left':
      return `left:${_pos.left - _appendEl.offsetWidth - 8}px;top:${_pos.top - _h / 2}px;`;
      // return `left:${_pos.left - _appendEl.offsetWidth  - 20}px;top:${_pos.top - _appendEl.offsetHeight / 2 + _h / 2}px;`;
      break;
    default:
      // return `left:${_pos.right + 8}px;top:${_pos.top - _appendEl.offsetHeight / 2 + _h / 2}px;`;
      return `left:${_pos.right + 11}px;top:${_pos.top - _h / 2}px;`;
      break;
  }
}
const directive = {
  focus,
  tip,
  letterfx,
  typing,
  blur
};
export default directive;