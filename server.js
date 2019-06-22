const io = require('socket.io')(8023);
const exec = require('child_process').exec;

var execCmd;

/*
 * サーバの接続
 */
io.on('connection', function ( socket ) {
  // コマンドの実行
  socket.on('exec', function ( command ) {
    execCmd = exec(command);
    console.log(execCmd.pid);

    // 実行中の出力を受け取る
    execCmd.stdout.on('data',function(data) {
      console.log(data);
      data = data.split(/\r\n|\n/);
      io.sockets.emit('response', {data:data});
    });

    execCmd.stderr.on('data', function (data) {
      console.log(data);
      data = data.split(/\r\n|\n/);
      io.sockets.emit('response', {data:data});
    });

    execCmd.on('exit', function (code) {
      io.sockets.emit('exit', {data:code});
    });
  });

  //コマンドを強制終了させる
  socket.on( 'kill' , function(){
    process.kill(execCmd.pid+1);
    io.sockets.emit('response', {data:'Process Killed'});
  });
});

console.log('Start socket server : http://127.0.0.1:8023');
