module.exports = function (shipit) {
  require('shipit-deploy')(shipit);

  shipit.initConfig({
    default: {
      workspace: './dist',
      deployTo: '/www/all-releases',
      repositoryUrl: 'https://github.com/anas3636/shipit-example.git',
      ignores: ['.git', 'node_modules'],
      keepReleases: 5,
      deleteOnRollback: true,
      key: '/home/anasdev/.ssh/mykey',
      shallowClone: true
    },
    dev: {
      servers: 'anasdev@0.0.0.0.0',
      build : 'ng build --dev --aot'
     },
    production: {
      servers: 'anasdprod@0.0.0.0.0',
      build : 'ng build --prod --aot'
    }
  });
  shipit.task('default', function () {
    return shipit.local(shipit.config.build)
  });

  shipit.task('sync',['default'], function () {
    shipit.log('Build:Finished')
    return shipit.local('rsync -azP ' + shipit.config.workspace + ' ' + shipit.config.servers + ':'  + shipit.config.deployTo + '/' + releaseId)
  });

  shipit.task('deleteSymlink', ['sync'],function functionName() {
    return shipit.remote('rm -rf /www/curent-release')
    shipit.log('deleteSymlink:Finished')
  })

  shipit.task('symlink', ['deleteSymlink'],function functionName() {
    return shipit.remote('ln -s ' + shipit.config.deployTo + '/' + releaseId + '/dist /www/curent-release')
    shipit.log('Symlink:Finished')
  })
  shipit.start('default','sync','deleteSymlink','symlink')

};
//npm run build-prod
