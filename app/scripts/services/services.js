/*jslint
    browser: true,
    devel:true ,
    node:true,
    nomen: true,
    es5:true
*/

/**
 * @auth Gaurav Meena
 * @date 01/30/2014
 * service 
 */

/*global angular*/
'use strict';

angular.module('odeskApp')
    .factory('Workspace', ['$resource', '$q', '$http', function ($resource, $q, $http) {
        var item = $resource('/api/workspace/:workspaceID', {}, {
            all: { method: 'GET', params: { workspaceID: 'all' }, isArray: true },
            query: { method: 'GET', params: {}, isArray: false }
        });

        item.getMembersForWorkspace = function (workspaceId) {
            var deferred = $q.defer();
            var con = {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            };
            $http.get('/api/workspace/' + workspaceId + "/members", con)
                .success(function (data) {
                    deferred.resolve(data); //resolve data
                })
                .error(function (err) { deferred.reject(); });
            return deferred.promise;
        };

        item.addMemberToWorkspace = function (workspaceId, userId) {
            var deferred = $q.defer();
            var con = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            
            var roles = [
                "workspace/developer"
            ];

            var data = {
                "userId": userId,
                "roles": roles // needs to be array
            };

            $http.post('/api/workspace/' + workspaceId + "/members",
                data,
                con)
                .success(function (data) {
                    deferred.resolve(data); //resolve data
                })
                .error(function (err) { deferred.reject(); });
            return deferred.promise;

        };
        
        item.removeMember = function (workspaceId, userId) {
            var deferred = $q.defer();
            $http.delete('/api/workspace/' + workspaceId + '/members/' + userId)
                .success(function (data) {
                    deferred.resolve(data);
                })
                .error(function (err) {
                    deferred.reject();
                });
            return deferred.promise;
        };

        item.removeWorkspace = function (workspaceId) {
            var deferred = $q.defer();
            $http.delete('/api/workspace/' + workspaceId)
                .success(function (data) {
                    deferred.resolve(data);
                })
                .error(function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        return item;
    }]);

// Get workspace details based on workspace id
angular.module('odeskApp')
    .factory('WorkspaceInfo', function ($http, $q) {
      return {
        getDetail: function (workspaceId) {
          var deferred = $q.defer();
          var con = {
            headers: {
              'Accept': 'application/json',
              'X-Requested-With': 'XMLHttpRequest'
            }
          };
          $http.get('/api/workspace/' + workspaceId, con)
            .success(function (data) {
              deferred.resolve(data); //resolve data
            })

          return deferred.promise;
        }
      };
    });

 // for hiding docBoxes
angular.module('odeskApp')
  .factory('DocBoxService',function ($cookieStore) {
    var docboxes = [{'id':'1','title':'Hello World!','content':'Learn how to start first Codenvy project,Versioning,Building and Running it.'},
      {'id':'2','title':'Getting Your Projects on Codenvy','content':'Start importing your existing projects on Codenvy from GitHub, BitBucket or other desktop environments and getting them building and running.'},
      {'id':'3','title':'Understanding Custom Build and Run Codenvy Environments','content':'Learn how to create a Custom Build and Run Codenvy Environments for your Project.'}, 
      {'id':'4','title':'Contribute to Eclipse Che','content':'Get more information about how to contribute to Eclipse Che- the Open Source version of Codenvy and create plugins,extensions and new tooling applications.'}
      ];
  
    
   
    return {
      getDocBoxes: function () {
        var isShownItems =[]; 
        var docboxItems=[];
        if($cookieStore.get('UD_user_docboxes')==undefined)
          {
           angular.forEach(docboxes,function(v,k){
              isShownItems.push({'id':v.id,'isShown':true});
              docboxItems.push(v);
            });           
            $cookieStore.put('UD_user_docboxes',isShownItems);
          }
          else{
            isShownItems = $cookieStore.get('UD_user_docboxes');
            angular.forEach(docboxes,function(v1,k1){
              if(v1.id==isShownItems[k1].id && isShownItems[k1].isShown==true)
                {
                 docboxItems.push(v1);
                }
            });
          }    
          return docboxItems;        
        }, 

      hideDocBox: function(item){
        if($cookieStore.get('UD_user_docboxes'))
          {   
            var temp = [];
            angular.forEach($cookieStore.get('UD_user_docboxes'),function(v,k){
              if(v.id==item.id){
                  v.isShown=false;
                }
              temp.push(v);              
            }); 
            $cookieStore.put('UD_user_docboxes',temp);
          }
        }
      };
    });

angular.module('odeskApp')
	.factory('Profile', ['$http', '$q', function ($http, $q) {
	    return {
	        query: function () {
	            var deferred = $q.defer();
	            var con = {
	                headers: {
	                    'Accept': 'application/json',
	                    'X-Requested-With': 'XMLHttpRequest'
	                }
	            };
	            $http.get('/api/profile', con)
                    .success(function (data) {
                        deferred.resolve(data); //resolve data
                    })
                    .error(function (err) { deferred.reject(); });
	            return deferred.promise;
	        },

	        getById: function (userId) {
	            var deferred = $q.defer();
	            var con = {
	                headers: {
	                    'Accept': 'application/json',
	                    'X-Requested-With': 'XMLHttpRequest'
	                }
	            };
	            $http.get('/api/profile/' + userId, con)
                    .success(function (data) {
                        deferred.resolve(data); //resolve data
                    })
                    .error(function (err) { deferred.reject(); });
	            return deferred.promise;
	        },

	        update: function (appValue) {
	            var deferred = $q.defer();
	            var con = {
	                headers: {
	                    'Content-Type': 'application/json; charset=UTF-8',
	                    'X-Requested-With': 'XMLHttpRequest'
	                }
	            };

	            $http.post('/api/profile', appValue, con)
                   .success(function (data) {
                       $('#btn-preloader1').removeClass('preloader');
                       $('#btn1').removeClass('btn-disabled');
                       $('#upadateProfileAlert .alert-success').show();
                       $('#upadateProfileAlert .alert-danger').hide();
                       $('#upadateProfileAlert .alert').mouseout(function () { $(this).fadeOut('slow'); });
                       deferred.resolve(data); //resolve data
                   })
                   .error(function (err) {
                       $('#btn-preloader1').removeClass('preloader');
                       $('#btn1').removeClass('btn-disabled');
                       $('#upadateProfileAlert .alert-danger').show();
                       $('#upadateProfileAlert .alert-success').hide();
                       $('#upadateProfileAlert .alert').mouseout(function () { $(this).fadeOut('slow'); });
                       deferred.reject();
                   });
	            return deferred.promise;
	        }
	    };
	}]);

angular.module('odeskApp')
	.factory('Users', function ($http, $q) {
	    return {
	        query: function () {
	            var deferred = $q.defer();
	            var con = {
	                headers: {
	                    'Accept': 'application/json',
	                    'X-Requested-With': 'XMLHttpRequest'
	                }
	            };
	            $http.get('/api/account', con)
                    .success(function (data) {
                        deferred.resolve(data); //resolve data
                    })
                    .error(function (err) { deferred.reject(); });
	            return deferred.promise;
	        },

	        getUserByEmail: function (email) {
	            var deferred = $q.defer();
	            var con = {
	                headers: {
	                    'Accept': 'application/json',
	                    'X-Requested-With': 'XMLHttpRequest'
	                }
	            };
	            $http.get('/api/user/find?email=' + email, con)
                    .success(function (data) {
                        deferred.resolve(data); //resolve data
                    })
                    .error(function (err) { deferred.reject(); });
	            return deferred.promise;
	        }
	    };
	});

angular.module('odeskApp')
	.factory('Account', function ($http, $q) {
	    return {
	        query: function (orgId) {
	            var deferred = $q.defer();
	            var con = {
	                headers: {
	                    'Accept': 'application/json',
	                    'X-Requested-With': 'XMLHttpRequest'
	                }
	            };
	            $http.get('/api/account/' + orgId + '/subscriptions', con)
                    .success(function (data) {
                        deferred.resolve(data); //resolve data
                    })
                    .error(function (err) { deferred.reject(); });
	            return deferred.promise;
	        },

          getAccounts: function (){
            var deferred = $q.defer();
            var con = {
              headers: {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
              }
            };
            $http.get('/api/account/', con)
                .success(function (data) {
                  deferred.resolve(data); //resolve data
                })
                .error(function (err) { deferred.reject(); });
            return deferred.promise;
          },

          getSubscription: function (accountId){
            var deferred = $q.defer();
            var con = {
              headers: {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
              }
            };
            $http.get('/api/account/'+ accountId +'/subscriptions', con)
                .success(function (data) {
                  deferred.resolve(data); //resolve data
                })
                .error(function (err) { deferred.reject(); });
            return deferred.promise;
          }
      };
	});

angular.module('odeskApp')
    .factory('OrgAddon', function ($rootScope, Account, $q) {
        var serviceIds = ["Saas", "OnPremises"];
        var packages = ["Team", "Enterprise"];
        var orgAddonData = {};
        orgAddonData.isOrgAddOn = false;
        orgAddonData.accounts = [];

        orgAddonData.update = function(accounts) {
            orgAddonData.isOrgAddOn = accounts.length > 0;
            orgAddonData.accounts = accounts;
            orgAddonData.currentAccount = accounts.length > 0 ? accounts[0] : null;
            $rootScope.$broadcast('orgAddonDataUpdated');
        };

        orgAddonData.updateCurrentAccount = function(account) {
            if (account != orgAddonData.currentAccount) {
                orgAddonData.currentAccount = account;
                $rootScope.$broadcast('orgAddonUpdateCurrentAccount');
            }
        };

        orgAddonData.getOrgAccounts = function () {
            var deferred = $q.defer();
            var accounts = [];

            Account.getAccounts().then(function (response) {
                angular.forEach(response, function (membership) {
                    if (membership.roles.indexOf("account/owner") >= 0) {
                        accounts.push(membership.accountReference);
                    }
                });

                var promises = [];
                var orgAccounts = [];
                angular.forEach(accounts, function (account) {
                    promises.push(
                        Account.getSubscription(account.id).then(function (response) {
                            var serviceId = _.pluck(response, 'serviceId')[0];
                            var packageName = _.pluck(_.pluck(response, 'properties'), 'Package')[0];
                            if (_.contains(serviceIds, serviceId) && _.contains(packages, packageName)) {
                                orgAccounts.push(account);
                            }
                        }));

                });
                $q.all(promises).then(function () {
                    orgAddonData.update(orgAccounts);
                    deferred.resolve();
                })
            });

            return deferred.promise;
        };


        return orgAddonData;
    });

angular.module('odeskApp')
	.factory('addSkill', function ($http, $q) {
	    return {
	        query: function (skillset) {
	            var config = {
	                method: 'POST',
	                headers: { 'Content-Type': 'application/json; charset=UTF-8' },
	                url: '/api/profile/prefs',
	                data: skillset
	            };
	            $http(config).success(function (data) {
	                $('#btn-preloader3').removeClass('preloader');
	                $('#btn3').removeClass('btn-disabled');
	                $('#addSkillsAlert .alert-success').show();
	                $('#addSkillsAlert .alert-danger').hide();
	            }).error(function (err) {
	                $('#btn-preloader3').removeClass('preloader');
	                $('#btn3').removeClass('btn-disabled');
	                $('#addSkillsAlert .alert-danger').show();
	                $('#addSkillsAlert .alert-success').hide();
	            });
	            setTimeout(function () { $('#addSkillsAlert .alert').fadeOut('slow'); }, 3000);
	        }
	    };
	});

angular.module('odeskApp').factory('removeSkills', function ($http) {
    return {
        update: function (skill) {
            var config = {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json; charset=UTF-8' },
                url: '/api/profile/prefs',
                data: new Array(skill)
            };
            $http(config).success(function (data) {
                $('#removeSkillsAlert .alert-success').show();
                $('#removeSkillsAlert .alert-danger').hide();
                setTimeout(function () { $('#removeSkillsAlert .alert').fadeOut('slow'); }, 3000);
            }).error(function (err) {
                $('#removeSkillsAlert .alert-danger').show();
                $('#removeSkillsAlert .alert-success').hide();
                setTimeout(function () { $('#removeSkillsAlert .alert').fadeOut('slow'); }, 3000);
            });
        }
    };
});


angular.module('odeskApp')
	.factory('addUsage', function ($http, $q) {
	    return {
	        update: function (appValue) {
	            var deferred = $q.defer();
	            var con = {
	                headers: {
	                    'Content-Type': 'application/json; charset=UTF-8',
	                    'X-Requested-With': 'XMLHttpRequest'
	                }
	            };

	            $http.post('/api/profile/prefs', appValue, con)
                   .success(function (data) {
                       $('#btn-preloader4').removeClass('preloader');
                       $('#btn4').removeClass('btn-disabled');
                       $('#usageAlert .alert-success').show();
                       $('#usageAlert .alert-danger').hide();
                       $('#usageAlert .alert').mouseout(function () { $(this).fadeOut('slow'); });
                       deferred.resolve(data); //resolve data
                   })
                   .error(function (err) {
                       $('#btn-preloader4').removeClass('preloader');
                       $('#btn4').removeClass('btn-disabled');
                       $('#usageAlert .alert-danger').show();
                       $('#usageAlert .alert-success').hide();
                       $('#usageAlert .alert').mouseout(function () { $(this).fadeOut('slow'); });
                       deferred.reject();
                   });
	            return deferred.promise;
	        }
	    };
	});

angular.module('odeskApp')
    .factory('Project', ['$resource', '$http', '$q', function ($resource, $http, $q) {
        var item = $resource('/api/project/:workspaceID', {}, {
            create: { method: 'POST', params: {}, isArray: false },
            query: { method: 'GET', params: {}, isArray: true },
            put: { method: 'PUT', params: { workspaceID: 'workspaceimb0rqn76p2euvn4' }, isArray: false },
            import: { method: 'POST', url: '/api/project/:workspaceID/import/:path' }
        });
        
        item.getPermissions = function (workspaceId, projectName) { // custom function added to the resource object
            var deferred = $q.defer();
            var con = {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            };
            $http.get('/api/project/' + workspaceId + "/permissions/" + projectName, con)
                .success(function (data) {
                    deferred.resolve(data); //resolve data
                })
                .error(function (err) { deferred.reject(); });
            return deferred.promise;
        };
        
        item.setPermissions = function (workspaceId, projectName, data) {
            var deferred = $q.defer();
            
            var con = {
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                }
            };
            
            $http.post('/api/project/' + workspaceId + "/permissions/" + projectName,
                data,
                con)
                .success(function (response) {
                    deferred.resolve(response); //resolve data
                })
                .error(function (err) { 
                    deferred.reject(); 
                });
              
            return deferred.promise;
        };
        
        return item;
    }]);

angular.module('odeskApp')
	.factory('Password', function ($http, $q) {
	    return {
	        update: function (pwd) {
	            var deferred = $q.defer();
	            $http.post('/api/user/password',
                    {
                        'password': pwd
                    },
                    {
                        headers: {
                            'Accept': '*/*',
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                            'X-Requested-With': 'XMLHttpRequest'
                        },
                        transformRequest: function (data) { // If this is not an object, defer to native stringification.

                            if (!angular.isObject(data)) {

                                return ((data == null) ? "" : data.toString());

                            }

                            var buffer = [];

                            // Serialize each key in the object.
                            for (var name in data) {

                                if (!data.hasOwnProperty(name)) {

                                    continue;

                                }

                                var value = data[name];

                                buffer.push(
                                    encodeURIComponent(name) +
                                    "=" +
                                    encodeURIComponent((value == null) ? "" : value)
                                );

                            }

                            // Serialize the buffer and clean it up for transportation.
                            var source = buffer
                                .join("&")
                                .replace(/%20/g, "+")
                            ;

                            return (source);
                        }
                    })
                    .success(function (data) {
                        $('#btn-preloader2').removeClass('preloader');
                        $('#btn2').removeClass('btn-disabled');
                        $('#changePasswordAlert .alert-success').show();
                        $('#changePasswordAlert .alert-danger').hide();
                        $('#changePasswordAlert .alert').mouseout(function () { $(this).fadeOut('slow'); });
                        deferred.resolve(data); //resolve data
                    })
                    .error(function (err) {
                        $('#btn-preloader2').removeClass('preloader');
                        $('#btn2').removeClass('btn-disabled');
                        $('#changePasswordAlert .alert-danger').show();
                        $('#changePasswordAlert .alert-success').hide();
			$('#changePasswordAlert .alert-danger').text(err.message);
                        deferred.reject();
                        $('#changePasswordAlert .alert').mouseout(function () { $(this).fadeOut('slow'); });
                    });
	            return deferred.promise;
	        }
	    };
	});
