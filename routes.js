const express = require('express')
const router = express.Router()
const client = require('./client')

router.get('/conversation', client.fetchAllConversationsForParticipant)
router.post('/conversation', client.createConversationWithParticipant)
router.get('/conversation/message', client.fetchMessagesForConversation)
router.post('/conversation/message', client.createMessage)
router.get('/conversation/participant', client.fetchAllParticipantsForConversation)
router.post('/conversation/participant', client.addParticipantToConversation)
router.get("/auth/user/:user", (req, res) => {
    const jwt = client.getAccessToken(req.params.user)
    res.send({token: jwt})
})

module.exports = router