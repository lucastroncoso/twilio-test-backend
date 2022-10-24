const { json } = require('body-parser');

const authToken = process.env.TWILIO_AUTH_TOKEN;
const accountSid = process.env.TWILIO_ACCOUNT_SID
const twilioApiKey = process.env.TWILIO_API_KEY_SID
const twilioApiSecret = process.env.TWILIO_API_KEY_SECRET
const client = require('twilio')(accountSid, authToken);
const AccessToken = require("twilio").jwt.AccessToken

// Used specifically for creating Chat tokens
const serviceSid = process.env.TWILIO_CONVERSATIONS_SERVICE_SID

const ChatGrant = AccessToken.ChatGrant
const twilio = client.conversations.v1.conversations

const createConversation = exports.createConversation = async (req, res) => {
    conversation = await twilio
        .create({ friendlyName: req.body.friendlyName })
        .then(conversation => {
            return conversation
        })
    return conversation
}

exports.createConversationWithParticipant = async (req, res) => {
    const conversation = await createConversation(req, res)
    await addParticipant(conversation.sid, req.body.senderIdentity)
    await addParticipant(conversation.sid, req.body.receiverIdentity)
    res.json(conversation)
       
}

exports.addParticipantToConversation = async (req, res) => {
    const participant = await twilio(req.body.conversationSid)
        .participants
        .create({ identity: req.body.identity })
        .then(participant => {
            console.log(participant)
            res.json(participant)
        });
}

exports.fetchAllConversationsForParticipant = async (req, res) => {
    await client.conversations.v1.participantConversations
        .list({ identity: req.body.identity, limit: 20 })
        .then(participantConversations => {
            participantConversations.forEach(p => console.log(p.conversationUniqueName))
            res.json(participantConversations)
        })
        .catch(err => console.log(err))
}

exports.fetchAllParticipantsForConversation = async (req, res) => {
    const conversation = await createConversation(req, res)
    await twilio(req.body.conversationSid)
        .participants
        .list({ limit: 20 })
        .then(participants => res.json(participants))
        .catch(err => console.log(err))
}

exports.fetchMessagesForConversation = async (req, res) => {
    await twilio(req.body.conversationSid)
        .messages
        .list({ limit: 20 })
        .then(messages => res.json(messages))
        .catch(err => console.log(err))
}

exports.createMessage = async (req, res) => {
    const message = await twilio(req.body.conversationSid)
        .messages
        .create({ author: req.body.author, body: req.body.body })
        .then(message => {
            console.log(message)
            res.json(message)
        })
        .catch(err => console.log(err))
}

exports.getAccessToken = (user) => {
    const token = new AccessToken(
        twilioAccountSid,
        twilioApiKey,
        twilioApiSecret,
        { identity: user }
    )
    token.addGrant(chatGrant)
    const jwt = token.toJwt()
    console.log(`Token for ${user}: ${jwt}`)
    return jwt
}

const chatGrant = new ChatGrant({
    serviceSid: serviceSid,
})

const addParticipant = async (conversationSid, identity) => {
    return await twilio(conversationSid)
        .participants
        .create({ identity: identity })
        .then(participant => {
            return participant
        });
}


