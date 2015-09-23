module.exports = function(grunt) {
  grunt.initConfig({
    lambda_invoke: {
        default: {
            options: {
                // Task-specific options go here.
            }
        }
    },
    lambda_package: {
        default: {
            options: {
                // Task-specific options go here.
            }
        }
    },
    lambda_deploy: {
        default: {
            arn: 'arn:aws:lambda:us-east-1:919386026801:function:twitteroauth', // Replace this with your own 
            options: {
                region: 'us-east-1'
            }
        }
    }
  });

  grunt.loadNpmTasks('grunt-aws-lambda');

  grunt.registerTask('deploy', ['lambda_package', 'lambda_deploy']);
  grunt.registerTask('default', ['lambda_package']);
};

