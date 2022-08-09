function AlertMes(txt, agr) {
    const alertBox = document.createElement('div');
    alertBox.setAttribute('class', 'alert '+agr);
    alertBox.innerHTML = txt;
    document.querySelector('.errobox').appendChild(alertBox);
    setTimeout(()=>{
        alertBox.remove();
    },6000)
}

export default AlertMes;