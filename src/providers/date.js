/**
 * 时间时间函数的拓展
 */
// 时间格式化 format=yyyy-MM-dd h:m:s
Date.prototype.format = function (format) {
    var date = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours()<10?'0'+this.getHours() : this.getHours(),
        "m+": this.getMinutes()<10?'0'+this.getMinutes() : this.getMinutes(),
        "s+": this.getSeconds()<10?'0'+this.getSeconds() : this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S+": this.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1
                ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
        }
    }
    return format;
}
Date.prototype.getDayOfMonth = function (y, Mm) {
    if (typeof y == 'undefined') { y = (new Date()).getFullYear(); }
    if (typeof Mm == 'undefined') { Mm = (new Date()).getMonth(); }
    var Feb = (y % 4 == 0) ? 29 : 28;
    var aM = new Array(31, Feb, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
    return aM[Mm];
};
// 获取上个月的时间戳
Date.prototype.getDateOfPreMonth = function (dt) {
    if (typeof dt == 'undefined') { dt = (new Date()); }
    var y = (dt.getMonth() == 0) ? (dt.getFullYear() - 1) : dt.getFullYear();
    var m = (dt.getMonth() == 0) ? 11 : dt.getMonth() - 1;
    var preM = this.getDayOfMonth;
    var d = (preM < dt.getDate()) ? preM : dt.getDate();
    return Date.parse(new Date(y, m, d));
};  