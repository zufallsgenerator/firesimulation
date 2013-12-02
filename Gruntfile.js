module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    gitcheckout: {
      master: {
        options: {
            branch: 'master'
        }
      },
      pages: {
        options: {
            branch: 'gh-pages'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-git');

  // Default task(s).
  grunt.registerTask('default', ['publish']);

};