import { ref } from "vue"

export const draggingHelper = () => {
    const dragging = ref<boolean>(false)
    const posX= ref<number>(0)
    const posY= ref<number>(164)
    const mouseX= ref<number>(0)
    const mouseY= ref<number>(0)
    const dragStart=(event : any)=> {
        dragging.value = true;
        mouseX.value = event.clientX - event.target.getBoundingClientRect().left;
        mouseY.value = event.clientY - event.target.getBoundingClientRect().top;
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);
    }
    const drag = (event : any) => {
        if (dragging.value) {
            posX.value = event.clientX - mouseX.value;
            posY.value = event.clientY - mouseY.value;
        }
    }
    const dragEnd =() => {
        dragging.value = false;
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', dragEnd);
    }
    const maximise = (x: number = 0, y: number= 64) => {
        posX.value = x;
        posY.value = y;
    }
    return {
        dragging,
        posX,
        posY,
        mouseX,
        mouseY,
        dragStart,
        maximise
    }  
}