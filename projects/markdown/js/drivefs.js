/*
class DriveFileSystem {
    
    initialize(root='/CloudFS/') {
        this.client = new GoogleDriveClient();
        this.cwd = root;
        this._fscache = this.list_dir();
    }
    
    abspath(path) {
        switch (1) {
            case path === '.':
                return this.cwd;
            
            case path[0] === '/':
                return path;
            
            default:
                return this.cwd + path;
        }
    }
    
    isfile(path, get_obj=false) {
        let data   = exists(path, true),
            result = result[0] && result[0]['type'] === 'file';
        
        return getobj ? [result, data[1]] : result;
    }
    
    ispath(path, get_obj=false) {
        let data   = exists(path, true),
            result = result[0] && result[0]['type'] === 'directory';
        
        return getobj ? [result, data[1]] : result;
    }
    
    exists(path, get_obj=false) {
        let ap = this.abspath(path);
        
        if (!get_obj) {
            let cached = this._fscache.get(ap, false),
                result = cached ? true : this._get_obj(ap) !== {};
        
        } else {
            let obj    = this._get_obj(ap),
                result = obj !== {} ? [true, obj] : [false, null];
        }
        
        return result;
    }
    
    list_dir(path='.') {
        // Get list of files in path as an array. Default path is the current working directory.
        return this.client.list_dir(this.abspath(path));
    }
    
    ls(path='.') {
        // Get list of files in path as an array. Default path is the current working directory. Alias for ls.
        return list_dir(path);
    }
    
    get_file(path) {
        return this._get_obj(this.abspath(path));
    }
    
    _get_obj(path) {
        return this.client.get(path);
    }
}
*/

// ================================================ 
function pickerCallback(data, editor_bind) {
    if (data['docs'] !== undefined) {
        let id = data['docs'][0]['id'];

        downloadFile(id, (file_data) => {
            let ed = document.querySelector('.markdown-pair[data-bind="' + editor_bind + '"] .editor');
            ed.value = file_data;

            // Force display update for editor
            ed.dispatchEvent(new Event('keyup', {bubbles: true, cancelable: true}));
        });
    }
}

// ----
function createPicker(editor) {
    var view = new google.picker.View(google.picker.ViewId.DOCS);
    // view.setMimeTypes("image/png,image/jpeg,image/jpg");
    
    var picker = new google.picker.PickerBuilder()
        .setOAuthToken(oauth_token)
        .addView(view)
        .addView(new google.picker.DocsUploadView())
        .setCallback((data) => pickerCallback(data, editor))
        .setMaxItems(1)
        .build();
        
    picker.setVisible(true);
}

/**
 * Download a file's content.
 *
 * @param {File} file Drive File instance.
 * @param {Function} callback Function to call when the request is complete.
 */
function downloadFile(fileID, callback) {
    var xhr = new XMLHttpRequest();
    var link = 'https://www.googleapis.com/drive/v2/files/' + fileID + '?alt=media';
    
    xhr.open('GET', link, true);
    xhr.setRequestHeader('Authorization', 'Bearer ' + oauth_token);
    
    xhr.onload  = () => { callback(xhr.responseText); }
    xhr.onerror = () => { console.log('Error encountered while downloading file'); }
    
    xhr.send(null);
}

// ================================================
function initClient() {
    // Initialize the client with API key and People API, and initialize OAuth with an
    // OAuth 2.0 client ID and scopes (space delimited string) to request access.
    
    gapi.client.init({
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
        clientId: '512221751639-qhbf77c6rjes8d1gvoktq71p9m5ok4eu.apps.googleusercontent.com',
        scope: 'https://www.googleapis.com/auth/drive'
    
    }).then(
        (response) => {
            GoogleAuth = gapi.auth2.getAuthInstance({ux_mode: 'redirect'});
            
            // Listen for sign-in state changes.
            GoogleAuth.isSignedIn.listen(updateSigninStatus);

            // Handle the initial sign-in state.
            updateSigninStatus(GoogleAuth.isSignedIn.get());
            
            window.dispatchEvent(new Event('OAuthLoaded'));
        },
        
        (reason) => {
            console.log('Error during OAuth: ' + reason.error.message);
        }
    );
}

// ----
function updateSigninStatus(isSignedIn) {
    // If the user is already signed in, dispatch UserLoggedIn event on window,
    // otherwise prompt for sign in.
    
    if (isSignedIn) {
        window.dispatchEvent(new Event('UserLoggedIn'));
        
    } else {
        gapi.auth2.getAuthInstance().signIn();
    }
}

var GoogleAuth,
    user = '',
    oauth_token = '';

document.addEventListener('DOMContentLoaded', () => {
    /* Load Google libraries */
    gapi.load('client:auth2:picker', initClient);

    window.addEventListener('UserLoggedIn', () => {
        user        = gapi.auth2.getAuthInstance().currentUser.get(),
        oauth_token = user.getAuthResponse().access_token;
    });
});
