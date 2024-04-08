 peerjs --port 9000 --key peerjs --path / &
 deno run --allow-net --allow-read --allow-write --watch ./BackEnd/main.ts &
 node ./BackEnd/webRTCServer/index.js &
 npm --prefix ./FrontEnd run dev

