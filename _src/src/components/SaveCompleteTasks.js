import React, { useEffect, useRef } from 'react'

const SaveCompleteTasks = ({getData}) => {
    const canvas = useRef(null)
    const saveBtn = useRef(null)

    let ctx;

    const draw = ()=>{
        // 描画
        ctx.fillStyle = '#ff0000'
        let padding = 30
        let height = 50
        ctx.font = "25px sans-serif"
        getData.forEach(item => {
            ctx.fillText(`・[${item.category}] ${item.name}`, padding, height)
            height += 50
        });
        return height
    }

    useEffect(()=>{
        ctx = canvas.current.getContext("2d")
        // 描画した際の高さを出力
        canvas.current.height = draw()
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0,0,canvas.current.width, canvas.current.height)
        // 再度描画
        draw()
        saveBtn.current.href = canvas.current.toDataURL('image/png')
        saveBtn.current.download = 'image'
    }, [getData])


  return (
    <div>
        <a  ref={saveBtn} className='btn btn-outline-success'>完了タスク画像保存</a>
        <canvas className='d-none' ref={canvas} width={'500px'} height={"100px"}></canvas>
    </div>
  )
}

export default SaveCompleteTasks