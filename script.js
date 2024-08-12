document.addEventListener("DOMContentLoaded", () => {
    const draggableContainer = document.getElementById("draggableContainer");
    const draggableArea = document.getElementById("draggableArea");
    const staticImage = document.getElementById("staticImage");
    const textElement = document.getElementById("text");

    const phrases = ['나는 보노보노', '길거리 생활 25년', '너는 누구냐!', '콜록콜록', 'I\'m Bonobono.', 'I\'ve been living on this wall for 25yrs.', 'Who are you!', '*cough*'];
    const fonts = ['Arial', 'Courier New', 'Georgia', 'Times New Roman', 'Verdana', 'Comic Sans MS'];

    let lastPhraseIndex = -1; // 마지막으로 선택된 문구의 인덱스

    // 이미지 랜덤 위치에 배치
    function placeImageRandomly(element, offsetX = 0, offsetY = 0) {
        const maxWidth = window.innerWidth - element.offsetWidth - offsetX;
        const maxHeight = window.innerHeight - element.offsetHeight - offsetY;
        const randomX = Math.floor(Math.random() * maxWidth);
        const randomY = Math.floor(Math.random() * maxHeight);

        element.style.left = `${randomX}px`;
        element.style.top = `${randomY}px`;
    }

    placeImageRandomly(draggableContainer);
    placeImageRandomly(staticImage);

    // 충돌 감지 함수
    function isColliding(el1, el2, el2OffsetX = 0, el2OffsetY = 0) {
        const rect1 = el1.getBoundingClientRect();
        const rect2 = el2.getBoundingClientRect();

        const el2CenterX = rect2.left + rect2.width / 2;
        const el2CenterY = rect2.top + rect2.height / 2;

        const el2CollisionRect = {
            left: el2CenterX - el2OffsetX / 2,
            right: el2CenterX + el2OffsetX / 2,
            top: el2CenterY - el2OffsetY / 2,
            bottom: el2CenterY + el2OffsetY / 2
        };

        return !(rect1.right < el2CollisionRect.left || 
                 rect1.left > el2CollisionRect.right || 
                 rect1.bottom < el2CollisionRect.top || 
                 rect1.top > el2CollisionRect.bottom);
    }

    // 드래그 기능
    let isDragging = false;
    let offsetX, offsetY;

    function startDrag(e) {
        isDragging = true;
        const clientX = e.clientX || e.touches[0].clientX;
        const clientY = e.clientY || e.touches[0].clientY;
        offsetX = clientX - draggableContainer.getBoundingClientRect().left;
        offsetY = clientY - draggableContainer.getBoundingClientRect().top;
        draggableContainer.style.transition = "none";
        e.preventDefault(); // 터치 이벤트에서 클릭을 방지하기 위해 기본 동작 방지
    }

    function onDrag(e) {
        if (isDragging) {
            const clientX = e.clientX || e.touches[0].clientX;
            const clientY = e.clientY || e.touches[0].clientY;
            const x = clientX - offsetX;
            const y = clientY - offsetY;
            draggableContainer.style.left = `${x}px`;
            draggableContainer.style.top = `${y}px`;

            // 충돌 감지 및 처리
            if (isColliding(draggableArea, staticImage, 50, 50)) { // staticImage의 중앙 50x50 영역을 충돌 영역으로 설정
                placeImageRandomly(staticImage);
            }
        }
    }

    function endDrag() {
        isDragging = false;
        draggableContainer.style.transition = "left 0.1s ease-out, top 0.1s ease-out";
    }

    draggableContainer.addEventListener("mousedown", startDrag);
    draggableContainer.addEventListener("touchstart", startDrag, { passive: false });

    document.addEventListener("mousemove", onDrag);
    document.addEventListener("touchmove", onDrag, { passive: false });

    document.addEventListener("mouseup", endDrag);
    document.addEventListener("touchend", endDrag);

    // 창 크기 변경 시 이미지 위치 재조정
    window.addEventListener("resize", () => {
        placeImageRandomly(draggableContainer);
        placeImageRandomly(staticImage);
    });

    // 5초마다 문구와 폰트를 랜덤으로 변경
    function updateText() {
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * phrases.length);
        } while (randomIndex === lastPhraseIndex);

        lastPhraseIndex = randomIndex;
        const randomPhrase = phrases[randomIndex];
        const randomFont = fonts[Math.floor(Math.random() * fonts.length)];
        textElement.textContent = randomPhrase;
        textElement.style.fontFamily = randomFont;
        textElement.style.color = 'white';
    }

    setInterval(updateText, 2500);
    updateText(); // 페이지 로드 시 처음 문구 설정
});
