![Badge em Versão](http://img.shields.io/static/v1?label=ftp&message=0.3.10&color=GREEN&style=for-the-badge)

# FTP Tutorial


É mostrado nesse exemplo as formas mais utilizadas no FTP,  utilizando a biblioteca ´ftp´ com node e javascript. com suas funções para executar ações e como são chamadas.

## Dados necessarios para conexão

Esses dados é para a conexão que é colocado com os dados para o FTP e ter acesso ao serviço e dados ao qual estão contidos e que foi conectado a ele.

```javascript
var config = {
    host: "HOST-FTP-AQUI",
    user: "USER-FTP-AQUI",
    password: "PASSWORD-FTP-AQUI",
    secure: false,
    secureOptions: {
        rejectUnauthorized: false
    },
    port: 21
};
```

## Verifica conexão

Aqui é retornado o status de conexão com o FTP para saber se foi conectado, tipo de conexão entre outros.

- Código da função
```javascript
async function statusFtp(params){
    return new Promise(async (resolve, reject) => {
        client.connect(params);
        client.on("ready", function () {
          client.status(function (err, status) {
            if (err) {
              console.error(err);
              reject(err);
            } else {
              console.log(status); 
              client.end();
              resolve(status);
            }
          });
        });
        client.on("error", function (err) {
          console.error(err);
          reject(err);
        });
      })
}

```
- Chamada da função
```javascript
 statusFtp(config)
    .then(() => console.log('Status do FTP'))
    .catch(err => console.log('Erro ao fazer upload: ', err));
```

## Lista os dados da conexão

Aqui é feita a conexão do e listagem das pastas e arquivos na raiz do FTP.

- Código da função
```javascript
async function listarHomeFTP(params) {
    return new Promise((resolve, reject) => {
        client.connect(params);
        client.on('ready', function() {
            client.list(function(err, list) {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    console.dir(list);  // Imprime a lista de diretórios e arquivos
                    client.end();
                    resolve(list);
                }
            });
        });
        client.on('error', function(err) {
            console.error(err);
            reject(err);
        });
    });
}
```
- Chamada da função
```javascript
listarHomeFTP(config)
    .then(list => console.log('Listagem concluída'))
    .catch(err => console.log('Erro ao listar: ', err));
```

## Busca por pastas no FTP

Aqui é feita a busca de diretorios no FTP através do endereço de pastas.

- Código da função
```javascript
async function searchDirFTP(params, directory) {
    return new Promise((resolve, reject) => {
        client.connect(params);
        client.on('ready', function() {
            client.cwd(directory, function(err) {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    client.list(function(err, list) {
                        if (err) {
                            console.error(err);
                            reject(err);
                        } else {
                            console.dir(list);  // Imprime a lista de diretórios e arquivos
                            client.end();
                            resolve(list);
                        }
                    });
                }
            });
        });
        client.on('error', function(err) {
            console.error(err);
            reject(err);
        });
    });
}
```
- Chamada da função
```javascript
searchDirFTP(config, '/GABRIEL/Files')
    .then(list => console.log('Listagem concluída'))
    .catch(err => console.log('Erro ao listar: ', err));
```

## Upload de arquivos para o FTP 

Aqui é feito o envio de arquivos da maquina do cliente para o FTP.

- Código da função
```javascript
async function uploadFile(params, directory, filePath) {
    return new Promise((resolve, reject) => {
        client.connect(params);
        client.on('ready', function() {
            client.cwd(directory, function(err) {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    let fileName = path.basename(filePath);
                    client.put(fs.createReadStream(filePath), fileName, function(err) {
                        if (err) {
                            console.error(err);
                            reject(err);
                        } else {
                            console.log('Arquivo enviado com sucesso!');
                            client.end();
                            resolve();
                        }
                    });
                }
            });
        });
        client.on('error', function(err) {
            console.error(err);
            reject(err);
        });
    });
}
```

- Chamada da função
```javascript
uploadFile(config, '/GABRIEL/Files', './upload/download.jfif')
    .then(() => console.log('Envio concluído'))
    .catch(err => console.log('Erro ao enviar: ', err)); 
```

## Donwload de arquivos do FTP

Nessa função é feito o donwload do arquivo deseja la do FTP

- Código da função
```javascript
async function downloadFile(params, directory, fileName) {
    return new Promise((resolve, reject) => {
        client.connect(params);
        client.on('ready', function() {
            client.cwd(directory, function(err) {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    client.get(fileName, function(err, stream) {
                        if (err) {
                            console.error(err);
                            reject(err);
                        } else {
                            stream.once('close', function() {
                                client.end();
                                console.log('Arquivo baixado com sucesso!');
                                resolve();
                            });
                            let downloadPath = path.join('./download', fileName);
                            stream.pipe(fs.createWriteStream(downloadPath));
                        }
                    });
                }
            });
        });
        client.on('error', function(err) {
            console.error(err);
            reject(err);
        });
    });
}
```
- Chamada da função
```javascript
downloadFile(config, '/GABRIEL/Files', 'download.jfif')
    .then(() => console.log('Download concluído'))
    .catch(err => console.log('Erro ao baixar: ', err));
```

## deleção de arquivos

Essa função faz deleção de arquivos que estão no FTP

- Código da função
```javascript
async function deleteFile(params, directory, fileName) {
    return new Promise((resolve, reject) => {
        client.connect(params);
        client.on('ready', function() {
            client.cwd(directory, function(err) {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    client.delete(fileName, function(err) {
                        if (err) {
                            console.error(err);
                            reject(err);
                        } else {
                            console.log('Arquivo excluído com sucesso!');
                            client.end();
                            resolve();
                        }
                    });
                }
            });
        });
        client.on('error', function(err) {
            console.error(err);
            reject(err);
        });
    });
}
```

- Chamada de função
```javascript
deleteFile(config, '/GABRIEL/Files', 'download.jfif')
    .then(() => console.log('Exclusão concluída'))
    .catch(err => console.log('Erro ao excluir: ', err));
```

## Criar uma nova pasta no FTP

Essa função cria uma pasta para o caminho e com o nome que deseja dentro do FTP

- Código da função
```javascript
async function createDirectory(params, directory) {
    return new Promise((resolve, reject) => {
        client.connect(params);
        client.on('ready', function() {
            client.mkdir(directory, function(err) {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    console.log('Pasta criada com sucesso!');
                    client.end();
                    resolve();
                }
            });
        });
        client.on('error', function(err) {
            console.error(err);
            reject(err);
        });
    });
}
```

- Chamada de função
```javascript
createDirectory(config, '/GABRIEL/Files/PDF')
    .then(() => console.log('Criação concluída'))
    .catch(err => console.log('Erro ao criar: ', err));
```

## Renomear Arquivo ou Pasta

Faz a troca de nome de um arquivo ou de uma pasta dentro do FTP

- Código da função
```javascript
async function renameFileOrDirectory(params, oldPath, newPath) {
    return new Promise((resolve, reject) => {
        client.connect(params);
        client.on('ready', function() {
            client.rename(oldPath, newPath, function(err) {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    console.log('Arquivo ou pasta renomeado com sucesso!');
                    client.end();
                    resolve();
                }
            });
        });
        client.on('error', function(err) {
            console.error(err);
            reject(err);
        });
    });
}
```

- Chamada de função
```javascript
renameFileOrDirectory(config, '/GABRIEL/Files/24.png', '/GABRIEL/Files/AniversarioJuli.png')
    .then(() => console.log('Renomeação concluída'))
    .catch(err => console.log('Erro ao renomear: ', err));
```


## Deleta Pasta

Faz a deleção de uma pasta dentro do FTP

- Código da função
```javascript
async function deleteDirectory(params, directory) {
    return new Promise((resolve, reject) => {
        client.connect(params);
        client.on('ready', function() {
            client.rmdir(directory, true, function(err) {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    console.log('Pasta excluída com sucesso!');
                    client.end();
                    resolve();
                }
            });
        });
        client.on('error', function(err) {
            console.error(err);
            reject(err);
        });
    });
}
```

- Chamada de função
```javascript
deleteDirectory(config, '/GABRIEL/Files/PDFs')
    .then(() => console.log('Exclusão concluída'))
    .catch(err => console.log('Erro ao excluir: ', err));
```

## Configuração de permissões

Faz a configuração de permissões das pastas e arquivos do FTP

- Código da função
```javascript
async function changePermissions(params, path, mode) {
    return new Promise((resolve, reject) => {
        client.connect(params);
        client.on('ready', function() {
            client.site(`CHMOD ${mode} ${path}`, function(err) {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    console.log('Permissões alteradas com sucesso!');
                    client.end();
                    resolve();
                }
            });
        });
        client.on('error', function(err) {
            console.error(err);
            reject(err);
        });
    });
}
```

- Chamada de função
```javascript
changePermissions(config, '/GABRIEL/Files', '745')
    .then(() => console.log('Alteração concluída'))
    .catch(err => console.log('Erro ao alterar: ', err));
```

## Upload de multiplos arquivos

Faz o envio de multiplos arquivos para o FTP

- Código da função
```javascript
async function uploadMultipleFiles(params, localDir, remoteDir) {
    return new Promise((resolve, reject) => {
        client.connect(params);
        client.on('ready', function() {
            fs.readdir(localDir, (err, files) => {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    let uploadPromises = files.map(file => {
                        return new Promise((resolve, reject) => {
                            let localPath = path.join(localDir, file);
                            let remotePath = remoteDir + '/' + file;
                            client.put(fs.createReadStream(localPath), remotePath, function(err) {
                                if (err) {
                                    console.error(err);
                                    reject(err);
                                } else {
                                    console.log(`Arquivo ${file} enviado com sucesso!`);
                                    resolve();
                                }
                            });
                        });
                    });
                    Promise.all(uploadPromises)
                        .then(() => {
                            console.log('Todos os arquivos foram enviados com sucesso!');
                            client.end();
                            resolve();
                        })
                        .catch(err => {
                            console.error('Erro ao enviar arquivos: ', err);
                            reject(err);
                        });
                }
            });
        });
        client.on('error', function(err) {
            console.error(err);
            reject(err);
        });
    });
}
```

- Chamada de função
```javascript
uploadMultipleFiles(config, './upload', '/GABRIEL/Files')
    .then(() => console.log('Upload concluído'))
    .catch(err => console.log('Erro ao fazer upload: ', err));
```

