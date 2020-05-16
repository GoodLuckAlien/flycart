
import flyCart from '../../utils/flyCart'

const app = getApp();
Component({
    properties: {
        /* 当前 x ,y 值 */
        current: {
            type: Object,
            value: {}
        },
        /* 图片 url  */
        imageUrl:{
            type:Object,
            value:''
        }
    },
    data: {
        bus_x:0, /* left */
        bux_y:0, /* top */
        cartHidden:true, /* 控制购物车图片显示与隐藏 */
        scale:1 /* 缩放比 */
    },
   
    attached() {
        this.end={
            x:375 * 4 /5,
            y:600
        }
        /* 获取屏幕宽高 */
        const windowWidth = app.globalData.windowWidth
        const windowHeight = app.globalData.windowHeight
        /* 购物车所在的位置 */
        this.end['y'] = windowHeight - 20
        this.end['x'] = windowWidth * 4 / 5 -50
        this.startCart()
    },
    methods: {
        startCart(){
            /* 开启购物车 */
            /* this.start 储存起始点 clientY clientY  ,this.end储存最终点 clientX clientY */
            this.start = {}
            this.start['x'] = this.data.current['x']
            this.start['y'] = this.data.current['y']
            const travelList = flyCart([ this.start['x'] , this.start['y'] ] ,[ this.end['x'] , this.end['y'] ],25,50 )
            this.startAnimation(travelList)
        },
        startAnimation(travelList) {
            let index = 0
            this.setData({
                cartHidden: false,
                bus_x: this.start['x'],
                bus_y: this.start['y']
            })
            if(travelList.length===0) return
            this.timer = setInterval( ()=> {
                index++
                const currentPoint = travelList.shift()
                this.setData({
                    bus_x: currentPoint[0],  /* left 值 */
                    bus_y: currentPoint[1],  /* top值 */
                    scale: 1 - index / 25    /* 缩放比 */
                })
                if (travelList.length === 0) {
                    clearInterval(this.timer)
                    this.triggerEvent('close')
                }
            }, 33)
        }
    }

})