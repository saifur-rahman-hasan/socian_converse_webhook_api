const fs = require('fs');
const { google } = require('googleapis');
const axios = require('axios');
const csvParser = require('csv-parser');


// YouTube Data API settings
const CLIENT_SECRETS_FILE = {
    "installed": {
        "client_id": "1076625300839-e9lc2m1qj3lv46cgi16bs5vvpm945li9.apps.googleusercontent.com",
        "project_id": "socian-converse",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_secret": "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",
        "redirect_uris": [
            "http://localhost"
        ]
    }
}; // Replace with the path to your JSON file
const SCOPES = ['https://www.googleapis.com/auth/youtube.force-ssl'];
const API_SERVICE_NAME = 'youtube';
const API_VERSION = 'v3';
const API_KEY = 'AIzaSyDaU_LC11aQToYC5b1pBbnVfmaIDb9Snwg'; // Replace with your API key
const OUTPUT_FOLDER = './output/'; // Replace with the desired output folder path

const youtubeService = axios.create({
    baseURL: 'https://www.googleapis.com/youtube/v3/',
});

export default class YoutubeManager {
    constructor(userId = null) {
        this.userId = null;
    }

    // Method for Authentication using OAuth 2.0
    async getAuthenticatedService() {
        try{

            let credentials;
            if (fs.existsSync('credentials_pickle.txt')) {
                credentials = JSON.parse(fs.readFileSync('credentials_pickle.txt'));
            } else {
                const { client_secret, client_id, redirect_uris } = CLIENT_SECRETS_FILE.installed;
                const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
                const authUrl = oAuth2Client.generateAuthUrl({
                    access_type: 'offline',
                    scope: SCOPES,
                });
                console.log('Authorize this app by visiting this URL:', authUrl);
            
                const code = ''; // Paste the authorization code here after granting permission
            
                const { tokens } = await oAuth2Client.getToken(code);
                credentials = tokens;
            
                fs.writeFileSync('credentials_pickle.txt', JSON.stringify(credentials));
            }
            
            const auth = new google.auth.GoogleAuth({
                credentials: credentials,
                apiKey: API_KEY,
                scopes: SCOPES,
            });
            
            // Build the YouTube Data API client
            return google.youtube({
                version: API_VERSION,
                auth: auth,
            });
        }catch(e){
            console.log("e######");
            console.log(e);
            console.log("e######");
        }
    }


    async createVideoComment(youtube, videoId, commentText) {
        // Create the comment
        const commentBody = {
            snippet: {
                videoId: videoId,
                topLevelComment: {
                    snippet: {
                        textOriginal: commentText,
                    },
                },
            },
        };
    
        try {
            await youtube.commentThreads.insert({
                part: 'snippet',
                requestBody: commentBody,
            });
            console.log('Comment posted successfully.');
        } catch (error) {
            console.error('Error posting comment:', error.message);
        }
    }
    
    async replyToComment(service, commentId, text) {
        // Create a comment resource with the reply text
        const commentResource = {
            snippet: {
                parentId: commentId,
                textOriginal: text,
            },
        };
    
        try {
            await youtube.comments.insert({
                part: 'snippet',
                requestBody: commentResource,
            });
            console.log('Replied to comment successfully.');
        } catch (error) {
            console.error('Error replying to comment:', error.message);
        }
    }
    
    async deleteComment(service, commentId) {
        try {
            await youtube.comments.delete({
                id: commentId,
            });
            console.log('Comment deleted successfully.');
        } catch (error) {
            console.error('Error deleting comment:', error.message);
        }
    }
    
    
    async likeVideo(youtube, videoId) {
        // Call the API to like the video
        try {
            await youtube.videos.rate({
                id: videoId,
                rating: 'like',
            });
            console.log('Video liked successfully.');
        } catch (error) {
            console.error('Error liking video:', error.message);
        }
    }
    
    async dislikeVideo(youtube, videoId) {
        // Call the API to dislike the video
        try {
            await youtube.videos.rate({
                id: videoId,
                rating: 'dislike',
            });
            console.log('Video disliked successfully.');
        } catch (error) {
            console.error('Error disliking video:', error.message);
        }
    }
    
    async videoUpload(youtube, videoFile, videoTitle, videoDescription, privacyStatus) {
        // Upload the video
        const media = {
            body: fs.createReadStream(videoFile),
        };
        const videoBody = {
            snippet: {
                title: videoTitle,
                description: videoDescription,
                categoryId: '22', // Category ID for "People & Blogs"
            },
            status: {
                privacyStatus: privacyStatus,
            },
        };
    
        try {
            const uploadResponse = await youtube.videos.insert({
                part: 'snippet,status',
                requestBody: videoBody,
                media: media,
            });
            console.log(`Video uploaded! Video ID: ${uploadResponse.data.id}`);
        } catch (error) {
            console.error('Error uploading video:', error.message);
        }
    }
    
    async deleteVideo(youtube, videoId) {
        // Delete the video
        try {
            await youtube.videos.delete({
                id: videoId,
            });
            console.log(`Video with ID ${videoId} has been deleted.`);
        } catch (error) {
            console.error('Error deleting video:', error.message);
        }
    }
    
    
    // Method to fetch top search results from YouTube for a given query
    async fetchSearchResults(query) {
        try {
            const response = await youtubeService.get('search', {
                params: {
                part: 'snippet',
                    q: query,
                    order: 'relevance',
                    maxResults: 500,
                    type: 'video',
                    relevanceLanguage: 'bn',
                    safeSearch: 'moderate',
                    key: API_KEY,
                },
            });
        
            return response.data.items;
        } catch (error) {
            console.error('Error fetching search results:', error.message);
            return [];
        }
    }
    
    // Method to fetch comments of a video from YouTube
    async fetchVideoComments(videoId) {
        try {
            const response = await youtubeService.get('commentThreads', {
                params: {
                part: 'snippet',
                videoId: videoId,
                maxResults: 100,
                order: 'relevance',
                textFormat: 'plainText',
                key: API_KEY,
                },
            });
        
            return response.data.items;
        } catch (error) {
            console.error('Error fetching video comments:', error.message);
            return [];
        }
    }
}






// Method to write data to a CSV file
// function writeToCSV(fileName, data) {
//   const csvWriter = csvParser.createCsvWriter({
//     path: OUTPUT_FOLDER + fileName,
//     header: [
//       'Query',
//       'Channel',
//       'Video Title',
//       'Video Description',
//       'Video ID',
//       'Comment',
//       'Comment ID',
//       'Replies',
//       'Likes',
//     ],
//   });

//   csvWriter.writeRecords(data).then(() => {
//     console.log('Data has been written to CSV:', fileName);
//   });
// }

// // Read the queries from the CSV file
// fs.createReadStream('H:/SOCIAN/YouTubeCrawlerOkay/ytb_queries.csv')
//   .pipe(csvParser())
//   .on('data', async (row) => {
//     const query = row.queries;
//     const queryResults = await fetchSearchResults(query);

//     const outputData = [];
//     for (const item of queryResults) {
//       const videoId = item.id.videoId;
//       const channel = item.snippet.channelTitle;
//       const videoTitle = item.snippet.title;
//       const videoDescription = item.snippet.description;

//       const videoComments = await fetchVideoComments(videoId);

//       for (const commentItem of videoComments) {
//         const comment = commentItem.snippet.topLevelComment.snippet.textDisplay;
//         const commentId = commentItem.snippet.topLevelComment.id;
//         const replyCount = commentItem.snippet.totalReplyCount;
//         const likeCount = commentItem.snippet.topLevelComment.snippet.likeCount;

//         outputData.push([
//           query,
//           channel,
//           videoTitle,
//           videoDescription,
//           videoId,
//           comment,
//           commentId,
//           replyCount,
//           likeCount,
//         ]);
//       }
//     }

//     writeToCSV(`bn_comment_${query}.csv`, outputData);
//   })
//   .on('end', () => {
//     console.log('CSV file has been processed.');
//   });

// ... (other functions: likeVideo, dislikeVideo, videoUpload, deleteVideo)

// // Main function to execute the YouTube API operations
// async function main() {
//   // Authenticate and get the YouTube Data API client
//   const youtubeServiceOK = await getAuthenticatedService();
//   console.log('Authenticated');

//   // Perform YouTube API operations here (createVideoComment, replyToComment, deleteComment, etc.)
//   // Example usage:

//   // Creating a New Parent Level Comment in YouTube Video
//   await createVideoComment(youtube, 'wx3NU_DrYjY', 'This is a comment from Socian Converse');
//   console.log(deleted, 'Parent Level Comment Created!!');

//   // Creating a New Comment in YouTube as Reply or Child Comment
//   await replyToComment(youtube, 'UgxziQCyIuoZRsB-7nl4AaABAg', 'This is a reply in comment');
//   console.log('Replied to Comment');

//   // Deleting a Comment in YouTube Video
//   const deleted = await deleteComment(youtube, 'UgxziQCyIuoZRsB-7nl4AaABAg.9sOcWmkTy2R9sRS-6JQCeb');
//   console.log(deleted, 'Deleted!!');

//   // Editing a Comment - Deleting the Past Comment and Re-Creating a New Comment
//   const deleted2 = await deleteComment(youtube, 'UgxziQCyIuoZRsB-7nl4AaABAg.9sOcWmkTy2R9sRS-6JQCeb');
//   console.log(deleted2, 'Deleted!!');
//   await replyToComment(youtube, 'UgxziQCyIuoZRsB-7nl4AaABAg', 'Thank you very much for your kindness!');
//   console.log('Recreated');


//   await likeVideo(youtubeServiceOK, 'wx3NU_DrYjY');
//   console.log('Video Liked');

//   await dislikeVideo(youtubeServiceOK, 'wx3NU_DrYjY');
//   console.log('Video Disliked');

//   await videoUpload(youtubeServiceOK, 'J:/mySearch_Intro.mp4', 'mySearch Intro', 'A brief overview of mySearch and how it is helping 180 Million people', 'unlisted');
//   console.log('Video Uploaded');

//   await deleteVideo(youtubeServiceOK, 'iLVneUtNHdI');
//   console.log('Video Deleted');

// }

// main().catch(console.error);