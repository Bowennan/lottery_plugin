/**
 **edited By 前端组--南海波 2017.04
*/

class ScratchCard {
    constructor(props) {
        // 定义校验规则
        this.propTypes = {
            containerId      : 'string.isRequired', //容器id
            resultClass      : 'string.notRequired', //结果class
            maskKlass        : 'string.notRequired', //刮层class
            defaultText      : 'string.notRequired', //默认结果
            defaultColor     : 'string.notRequired', //刮层颜色
            rubberSize       : 'number.notRequired', //橡皮尺寸
        };
        // 参数赋值
        this.state           = props ? props : {}; //把外界参数负值到内部使用
        this.rubberLock      = false; //橡皮锁

        // 定义容器及组件的样式
        this.scratchCardStyle = `#${this.state.containerId}{
            position:relative;
        }`;
        this.scratchCardResultStyle = `.scratch_card_result{
            width : 100%;
            height: 100%;
            color : #333;
            font-size  : 18px;
            line-height: 50px;
            text-align : center;
            background : #f1f1f1;
        }`
        this.scratchCardMaskStyle = `.scratch_card_mask{
            position : absolute;
            top      : 0;
            left     : 0;
        }`

        // 初始化部分方法
        this._$              = selector => document.querySelector(selector); //用于选择DOM
        this._createElement  = type => document.createElement(type); //用于创建DOM
        this._setContent     = (elem, content) => elem.textContent = content //用于文本赋值
        this._appendChild    = (container, node) => container.appendChild(node); //用于增加子节点

        // 启动流程
        this._init();
    }

    //流程
    _init() {
        this._validate(); //校验参数
        this._addStyle(); //创建样式
        this._addResult(); //创建结果
        this._addMask(); //创建刮层
    }

    //校验
    _validate() {
        const propTypes            = this.propTypes; //获取校验规则
        Object.getOwnPropertyNames(propTypes).forEach((val, idx, array) => { //遍历校验规则
            let stateType          = typeof this.state[val]; //当前类型
            let propsType          = propTypes[val].split('.')[0]; //规则类型
            let required           = propTypes[val].split('.')[1]; //规则参数是否必传
            let isRequired         = required === 'isRequired' ? true : false; //验证当前参数是否必传
            let isPropType         = propsType === typeof this.state[val] ? true : false; //验证当前类型与规则类型是否相等
            let errorType          = `${val} type should be ${propsType} but ${stateType}`; //类型错误抛出异常值
            let errorIsQu          = `${val} isRequired!'`; //必传参数抛出类型异常值

            if (isRequired && !this.state[val]) { //如果为必传参数但是没有传值
                throw new Error(errorIsQu); //抛出异常
            }

            if (!isPropType && this.state[val]) { //如果当前类型与规则类型不等
                throw new Error(errorType); //抛出异常
            }
        });
    }

    /**
     * [_addStyle description]
     * 在 head 标签内创建 style 元素并插入样式
     */
    _addStyle() {
        let $            = this._$;
        // 创建样式style标签
        let style        = this._createElement('style');
        //把样式的字符串去除空格
        let styleContent = `${this.scratchCardStyle}${this.scratchCardMaskStyle}${this.scratchCardResultStyle}`.replace(/\s/g, "");
        console.log(styleContent)
        // 字符串插入style标签
        this._setContent(style, styleContent);
        // 把style标签插入head标签
        this._appendChild($('head'), style);
    }

    /**
     * [_addResult description]
     * 在目标容器插入 canvas 蒙层下方的 DOM 文本并设置中奖提示
     */
    _addResult() {
        let $ = this._$;
        // 创建div标签
        let resultElem = this._createElement('div');
        // 为div标签添加class
        resultElem.setAttribute("class", `scratch_card_result ${this.state.resultClass}`);
        // 为div标签添加内容
        this.state.defaultText && this._setContent(resultElem, '谢谢惠顾');
        // 把div插入实例容器中
        this.state.containerId && this._appendChild($(`#${this.state.containerId}`), resultElem);
    }

    /**
     * [_addMask description]
     * 在目标容器插入 canvas 蒙层
     */
    _addMask() {
        let $ = this._$;
        let parentElem = $(`#${this.state.containerId}`);
        // 创建canvas标签
        let canvasElem = this._createElement('canvas');
        // 为canvas标签添加class
        canvasElem.setAttribute('class', `scratch_card_mask ${this.state.maskKlass}`);

        // 设置canvas宽高
        let canvasHight = parentElem ? parentElem.offsetHeight : 0;
        let canvasWidth = parentElem ? parentElem.offsetWidth : 0;
        canvasElem.setAttribute('width', canvasWidth);
        canvasElem.setAttribute('height', canvasHight);

        //画一个蒙层
        let context = canvasElem.getContext("2d");
        //设置蒙颜色
        context.fillStyle = this.state.defaultColor ? this.state.defaultColor : "#999";
        // 绘制
        context.fillRect(0, 0, canvasWidth, canvasHight);

        //监听开始刮事件
        canvasElem.addEventListener('mousedown', (e) => this._mousedownEvent(e, canvasElem))

        //监听刮着事件
        canvasElem.addEventListener('mousemove', (e) => this._mousemoveEvent(e, canvasElem, context))

        //监听刮完事件
        canvasElem.addEventListener('mouseup', (e) => this._mouseupEvent())

        // 插入容器
        parentElem && this._appendChild(parentElem, canvasElem);
    }

    //监听开始刮事件
    _mousedownEvent(event, canvasElem) {
        // 打开橡皮锁
        this.rubberLock = true;
    }

    //监听刮着事件
    _mousemoveEvent(event, canvasElem, context) {
        // 橡皮是否被锁
        if (!this.rubberLock) {
            return
        }
        // 获取容器距离浏览器左上角的距离
        var boundTop   = canvasElem.getBoundingClientRect().top;
        var boundLeft  = canvasElem.getBoundingClientRect().left;
        // 计算鼠标距离容器左上角的距离
        var mouseX     = event.clientX - boundLeft;
        var mouseY     = event.clientY - boundTop;
        // 设置橡皮大小
        var rubberSize = this.state.rubberSize ? this.state.rubberSize : 10;
        // 开始刷
        context.clearRect(mouseX, mouseY, rubberSize, rubberSize); //终止位置
    }

    //监听刮完事件
    _mouseupEvent() {
        // 橡皮上锁
        this.rubberLock = false;
    }


    /* 以下方法暴露给外部使用
     ** changeResult 用于修改结果文本
     ** refreshMask  用于重绘蒙层
     */

    // 修改结果
    changeResult(context) {
        let $ = this._$;
        // 获取结果DOM结构
        let contextElem = $(`#${this.state.containerId} .scratch_card_result`)
        // 判断然后修改
        this.state.containerId && context && this._setContent(contextElem, context)
    }

    // 重绘蒙层
    refreshMask() {
        let $ = this._$;
        // 获取蒙层canvasDOM结构
        let parentElem    = $(`#${this.state.containerId}`);
        let canvasElem    = $(`#${this.state.containerId} .scratch_card_mask`)
        // 获取宽高
        let canvasHight   = parentElem ? parentElem.offsetHeight : 0;
        let canvasWidth   = parentElem ? parentElem.offsetWidth : 0;
        // 开启canvas2D
        let context       = canvasElem.getContext("2d");
        // 设置颜色
        context.fillStyle = this.state.defaultColor ? this.state.defaultColor : "#999";
        // 判断并重设
        this.state.containerId && context.fillRect(0, 0, canvasWidth, canvasHight);
    }
}