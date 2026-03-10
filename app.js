// 生成星级
function starRating(num){
    return "⭐".repeat(num)
}

// -----------------------------
// 可选：计算综合评分（效果/利润/数量加权）
// -----------------------------
function computeScore(p, maxEffect, minEffect, maxProfit, minProfit, maxQty, minQty){
    // 归一化指标 0~1
    const effectNorm = (p.effectiveness - minEffect) / (maxEffect - minEffect || 1)
    const profitNorm = (p.profit - minProfit) / (maxProfit - minProfit || 1)
    const qtyNorm = (p.quantity - minQty) / (maxQty - minQty || 1)

    // 权重设置：可根据需求调整
    const alpha = 0.5  // 效果
    const beta  = 0.3  // 利润
    const gamma = 0.2  // 数量

    return alpha*effectNorm + beta*profitNorm + gamma*qtyNorm
}

// -----------------------------
// 排序逻辑
// -----------------------------
if(products.length > 0 && products[0].effectiveness !== undefined){
    // 计算归一化范围
    const effects = products.map(p=>p.effectiveness)
    const profits = products.map(p=>p.profit)
    const qtys = products.map(p=>p.quantity)

    const maxEffect = Math.max(...effects), minEffect = Math.min(...effects)
    const maxProfit = Math.max(...profits), minProfit = Math.min(...profits)
    const maxQty = Math.max(...qtys), minQty = Math.min(...qtys)

    products.forEach(p=>{
        p.score = computeScore(p, maxEffect, minEffect, maxProfit, minProfit, maxQty, minQty)
    })

    // 按综合评分排序，高分在前
    products.sort((a,b)=>b.score - a.score)
}else{
    // 原排序逻辑：推荐指数高 → 前，价格低 → 前
    products.sort((a,b)=>{
        if(b.rating !== a.rating){
            return b.rating - a.rating
        }
        return parseFloat(a.price.replace("$","")) - parseFloat(b.price.replace("$",""))
    })
}

// -----------------------------
// 首页卡片生成（自动更新）
// -----------------------------
const cardContainer = document.getElementById("cardContainer")
if(cardContainer){
    cardContainer.innerHTML = "" // 清空旧内容

    products.forEach(p=>{
        const card = document.createElement("div")
        card.className="card"
        card.innerHTML=`
            <h2>${p.name}</h2>
            <p>单价：${p.price}</p>
            <p>起提：${p.min}</p>
            <p class="stars">${starRating(p.rating)}</p>
            <a class="detail-btn" href="compare.html#${encodeURIComponent(p.name)}">详细参数</a>
        `
        cardContainer.appendChild(card)
    })
}

// -----------------------------
// 表格生成
// -----------------------------
const tableBody = document.getElementById("tableBody")
if(tableBody){
    tableBody.innerHTML="" // 清空旧内容
    products.forEach(p=>{
        const row = document.createElement("tr")
        row.innerHTML=`
            <td><a href="#${encodeURIComponent(p.name)}">${p.name}</a></td>
            <td>${p.price}</td>
            <td>${p.min}</td>
            <td>${p.delivery}</td>
            <td>${p.rate}</td>
            <td>${starRating(p.rating)}</td>
        `
        tableBody.appendChild(row)
    })
}

// -----------------------------
// 出数格式生成 + 小表格示例
// -----------------------------
const formatContainer = document.getElementById("formatContainer")
if(formatContainer){
    formatContainer.innerHTML="" // 清空旧内容
    products.forEach(p=>{
        const block = document.createElement("div")
        block.className="format-block"
        block.id = encodeURIComponent(p.name)

        // 生成表头
        let headerHTML = "<tr>"
        p.format.forEach(f=>{
            headerHTML+=`<th>${f}</th>`
        })
        headerHTML+="</tr>"

        // 生成前2条示例数据
        let examplesHTML=""
        if(p.examples){
            p.examples.forEach(ex=>{
                examplesHTML+="<tr>"
                ex.forEach(val=>{
                    examplesHTML+=`<td>${val}</td>`
                })
                examplesHTML+="</tr>"
            })
        }

        block.innerHTML=`
            <h3>${p.name}</h3>
            <div class="example-table-container">
                <table class="example-table">
                    <thead>${headerHTML}</thead>
                    <tbody>${examplesHTML}</tbody>
                </table>
            </div>
        `
        formatContainer.appendChild(block)
    })
}