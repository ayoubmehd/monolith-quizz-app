(() => {
    const answerText = document.querySelector("#answer_text");
    const isCorrect = document.querySelector("#is_correct");
    const addAnswer = document.querySelector("#add_answer");

    // const checkboxes = Array.from(document.querySelectorAll("input[type='checkbox'][name]"));

    if (!answerText || !isCorrect || !addAnswer) return;

    addAnswer.addEventListener("click", () => {
        if (!answerText.value) return;

        const newAnswer = { text: answerText.value, isCorrect: isCorrect.checked }

        createAnswer(newAnswer);

        console.log(newAnswer);


    });

})();

function createAnswer({ text, isCorrect }) {

    const answersCountainer = document.querySelector("#answers_countainer");

    const hiddenInput = createElement({
        tagName: 'input',
        attrs: {
            type: 'hidden',
            name: 'is_correct',
            value: 'false',
        }
    });

    const newAnswerEl = createElement({
        tagName: 'div',
        attrs: {
            class: 'flex w-full'
        },
        children: [
            createElement({
                tagName: 'input',
                attrs: {
                    type: 'hidden',
                    name: 'answers',
                    value: text
                }
            }),
            createElement({
                tagName: 'div',
                attrs: {
                    class: 'pr-3 py-2 w-3/4'
                },
                children: [
                    createElement({
                        tagName: 'p',
                        attrs: {
                            class: 'px-3 py-2'
                        },
                        children: [
                            text
                        ]
                    })
                ]
            }),
            createElement({
                tagName: 'div',
                attrs: {
                    class: 'px-3 py-2 flex items-center'
                },
                children: [
                    hiddenInput,
                    createElement({
                        tagName: 'input',
                        attrs: {
                            type: 'checkbox',
                            name: 'is_correct',
                            value: isCorrect,
                            ...(isCorrect ? { checked: 'checked' } : {}),
                            onchange: ($event) => {
                                $event.currentTarget.value = $event.currentTarget.checked;
                                hiddenInput.value = $event.currentTarget.value;
                                if ($event.currentTarget.checked) {
                                    return hiddenInput.disabled = true;
                                }
                                hiddenInput.disabled = false;
                            }
                        }
                    }),
                ]
            })
        ]
    });

    answersCountainer.insertAdjacentElement('beforeend',
        newAnswerEl
    );

}

function createElement({ tagName, attrs = {}, children = [] }) {
    const $el = document.createElement(tagName);

    for (const [k, v] of Object.entries(attrs)) {
        if (k.startsWith('on')) {
            $el.addEventListener(k.replace('on', ''), v);
            continue;
        }

        $el.setAttribute(k, v);
    }

    for (const child of children) {
        if (typeof child === 'string') {
            $el.appendChild(document.createTextNode(child));
        } else $el.appendChild(child)
    }

    return $el;

}