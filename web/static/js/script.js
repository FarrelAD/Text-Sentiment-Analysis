const textForm = document.getElementById('text-form');
const result = document.getElementById('result');


textForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(this);

    switch (formData.get('processing')) {
        case 'server': await serverProcessing(formData, this.action, this.method); break;
        case 'client': await clientProcessing(formData); break;
    }
});


async function clientProcessing(formData) {
    async function loadModel() {
        const session = new onnx.InferenceSession();
        return await session.loadModel('/static/model/sentiment_model.onnx');
    }


    const text = formData.get('text');

    if (!text) {
        alert('Please enter some text.');
        return;
    }

    let session
    try {
        session = await loadModel();
    } catch (error) {
        console.error('Error load model!')
        console.error(error)
    }

    const inputTensor = new onnx.Tensor(
        new TextEncoder().encode(text), 
        'string', 
        [1]
    );

    const output = await session.run([inputTensor]);

    console.log('output')
    console.log(output)
    const sentiment = output.values[0].data[0];
    console.log(sentiment)
    result.textContent = sentiment;
}

async function serverProcessing(formData, url, method) {
    try {
        const response = await fetch(url, {
            method: method,
            body: formData
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        result.textContent = data.sentiment
    } catch (error) {
        console.error(error)
        alert('There is something error in the server!')
    }
}