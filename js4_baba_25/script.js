const video = document.getElementById('video')　//videoタグ idを取得

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
  faceapi.nets.faceExpressionNet.loadFromUri('./models')
  //modelファイル内参考url https://note.com/npaka/n/nc9c244b11089
]).then(startVideo)

function startVideo() {
  navigator.getUserMedia( //webブラウザよりメディア情報取得(ストリーム情報)
    { video: {} },//videoのオブジェクト取得
    stream => video.srcObject = stream,//アロー関数　function stream = stream => videoのオブジェクトにgetUserMediaで取得されたストリーム情報を入れ込む
    //参考url https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Functions/Arrow_functions
    //参考url https://www.codegrid.net/articles/2017-get-user-media-1/
    //参考url https://houwa-js.co.jp/2019/06/20190604/ getUserMediaはローカルストレージ上で作動
    err => console.error(err) //console.error()でエラーの場合の結果を表示
  )
}

video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, resizedDetections)
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
  }, 100)
})