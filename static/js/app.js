/*前端组--南海波*/
'use strict';

/* 
 ** 我们来模拟一次调用吧！
 ** 传入相关参数，设定好动画的一些必要参数
 ** @class SlotMachine 初始化老虎机，传入动画对象和动画参数
 ** @param {array} dom 动画对象
 ** @param {object} animate 动画参数
 ** animate 对象的 startPos,endPos 都是用户根据自己的老虎机情况自行计算的。
 */
var slotmachine = new SlotMachine({
    dom: ['superheros-list01', // 必要的动画对象
    'superheros-list02', 'superheros-list03'],
    animate: {
        startPos: -60, // 必要的动画开始位置，初始化后 js 会把你的动画对象调整到 -60px 的位置。
        endPos: -1050, // 必要的动画结束位置，每一次循环结束动画对象的位置。
        counts: [5, 6, 7] // 非必要的动画循环次数，因为这里执行了3个动画对象，那么就有对应的3个动画循环次数。
    }
});

// 通常服务器只会告诉你，中奖的序列号，例如中了第 n 个奖品，或者没有中奖，都要把它换算成每个动画循环结束停下来的位置。
// 这里不在老虎机内部实现中奖序列号换算的原因在于你们要写的老虎机可能都不一样，那么老虎机动画停下来的位置也不一样，不如让用户自行计算。
// 这是一个中奖结果换算后的坐标位置
window.lock = false;
var prizeArray = [-940, -940, -940];

document.getElementById('start').addEventListener('click', function () {
    // 这里应该添加锁，避免在动画运行的时候重复触发
    // 开始游戏
    if (window.lock) return;
    // 加锁
    window.lock = true;
    slotmachine.run(prizeArray, function () {
        console.log('抽奖结束');
        // 解锁
        window.lock = false;
    });
});