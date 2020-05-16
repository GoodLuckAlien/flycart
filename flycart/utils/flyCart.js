/**
 * 飞入购物车，轨迹点绘制
 * @author  👽
 * @param {Array} startPoint 起点坐标clientX, clientY值 (必要)
 * @param {Array} endPoint   终点坐标clientX, clientY值 (必要)
 * @param {number} point     点数          (必要) 
 * @param {number} h         抛物线向上高度       (可选)
 * @param {number} hclientX  当存在h情况下，达到最高点时候的clientX值
 */
function flycart(startPoint, endPoint, point, h = 0, hclientX) {
    /* 
    设置startPoint 为(0,0)点 , 此抛物线经过(0,0)点 ，可以推到出模型关系式 y =  ax^2 + bx 或者 y = ax^ 2
    1 当存在 h 的情况，抛物线会y轴向上偏移 h, 此时的关系式 y = ax^2 + bx
    2 当不存在h 的情况 ，抛物线startPoint为顶点， 此时关系式 y = ax^2 
    */

    /* 参数校验 */
    function Validityparameter() {
        let isOkey = true
        Array.isArray(startPoint) && startPoint.length !== 2 && (isOkey = false)
        Array.isArray(endPoint) && endPoint.length !== 2 && (isOkey = false)
            (point.constructor !== Number) && (isOkey = false)
        return isOkey
    }

    /* 参数验证 */
    if (!Validityparameter()) {
        return []
    }

    /* A点横坐标 */
    const xA = 0
    /* A点纵坐标 */
    const yA = 0
    /* x轴偏移量 */
    const offsetX = startPoint[0]
    /* y轴偏移量 */
    const offsetY = startPoint[1]
    /* B点横坐标 */
    const xB = endPoint[0] - offsetX
    /* B纵坐标 */
    const yB = endPoint[1] - offsetY

    /* 根据B点坐标和最大高度h求系数a,b 参数*/
    let b = 0
    let a = 0

    function handerComputer() {
        if (h < 10) {
            a = yB / Math.pow(xB, 2)
        } else {
            /* 因为一般购物车的情况都是向下，实际上我们购物车的坐标系是反向的，所以我们这里要把h 设置成负值 */
            h = -h
            /* 一元二次求解a,b ，现在知道一点  ( xB , yB ) 另外一点 （ maxHx，h ）  */
            /* 有效达到最高点时候的x坐标 */
            const effectMaHx = hclientX && Math.abs(hclientX - offsetX) > 0 && Math.abs(hclientX - offsetX) < Math.abs(xB)
            /* 如果hclientX不满足要求，则选A , B 中点为   */
            let maxHx = effectMaHx ? (hclientX - offsetX) : (xB + xA) / 2
            /* 已知两点 求 a , b值  根据解方程式解得 y = ax^2 + bx  */
            a = ((yB / xB) - (h / maxHx)) / (xB - maxHx)
            /* 将 a 带入其中一个求解 b */
            b = (yB - a * Math.pow(xB, 2)) / xB
        }
    }


    /* 轨迹数组 */
    const travelList = []
    /* x 均等分 */
    const averageX = (xB - xA) / point

    /* 处理直线运动 */
    function handerLinearMotion(type) {
        if (type === 'X') {
            const averageY = (yB - yA) / point
            for (let i = 1; i <= point; i++) {
                travelList.push([offsetX, i * averageY + offsetY])
            }
        } else {
            for (let i = 1; i <= point; i++) {
                travelList.push([offsetX + i * averageX, offsetY])
            }
        }
        return travelList
    }

    /* 当 xB的绝对值小于10的情况，我们看作Y轴直线运功    */
    if (Math.abs(xB) < 10) {
        return handerLinearMotion('X')
    }
    /*当 yB的绝对值小于10的情况，我们看作x轴直线运功  */
    if (Math.abs(yB) < 10) {
        return handerLinearMotion('Y')
    }

    handerComputer()
    /* 绘制路径 */
    for (let i = 1; i <= point; i++) {
        const currentX = averageX * i
        const currentY = Math.pow(currentX, 2) * a + b * currentX - yA
        travelList.push([currentX + offsetX, currentY + offsetY])
    }

    return travelList
}

export default flycart