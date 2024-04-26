const Client = require('ftp');
const fs = require('fs');
const path = require('path');

const client = new Client();
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

/* Lista todos os arquivos a qual está na parte inicial do FTP */
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

/* Lista tudo que tem no FTP através de um caminho passado. */
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

/* Faz o upload de arquivos para o FTP */
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

/* Pega o arquivo do FTP e faz o donwload */
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

/* Deleta o arquivo do FTP */
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

/* Cria um novo diretorio no FTP */
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

/* Renomeia o nome de arquivos e diretorios no FTP */
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

/* Deleta pastas no FTP */
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

/* Muda as permissões de pastas e arquivos no FTP */
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

/* Envio de multiplos arquivos para o FTP */
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

/* uploadMultipleFiles(config, './upload', '/GABRIEL/Files')
    .then(() => console.log('Upload concluído'))
    .catch(err => console.log('Erro ao fazer upload: ', err)); */


/* changePermissions(config, '/GABRIEL/Files', '745')
    .then(() => console.log('Alteração concluída'))
    .catch(err => console.log('Erro ao alterar: ', err)); */

/* deleteDirectory(config, '/GABRIEL/Files/PDFs')
    .then(() => console.log('Exclusão concluída'))
    .catch(err => console.log('Erro ao excluir: ', err)); */

/* renameFileOrDirectory(config, '/GABRIEL/Files/24.png', '/GABRIEL/Files/AniversarioJuli.png')
    .then(() => console.log('Renomeação concluída'))
    .catch(err => console.log('Erro ao renomear: ', err)); */

/* createDirectory(config, '/GABRIEL/Files/PDF')
    .then(() => console.log('Criação concluída'))
    .catch(err => console.log('Erro ao criar: ', err)); */

/* deleteFile(config, '/GABRIEL/Files', 'download.jfif')
    .then(() => console.log('Exclusão concluída'))
    .catch(err => console.log('Erro ao excluir: ', err)); */

/* downloadFile(config, '/GABRIEL/Files', 'download.jfif')
    .then(() => console.log('Download concluído'))
    .catch(err => console.log('Erro ao baixar: ', err)); */


/* uploadFile(config, '/GABRIEL/Files', './upload/download.jfif')
    .then(() => console.log('Envio concluído'))
    .catch(err => console.log('Erro ao enviar: ', err)); */

/* searchDirFTP(config, '/GABRIEL/Files')
    .then(list => console.log('Listagem concluída'))
    .catch(err => console.log('Erro ao listar: ', err)); */

/* listarHomeFTP(config)
    .then(list => console.log('Listagem concluída'))
    .catch(err => console.log('Erro ao listar: ', err)); */


