const MeetingHistory = require('../../model/schema/meeting')
const mongoose = require('mongoose');

const add = async (req, res) => {
    try {
        if(!req.body.agenda){
            res.status(400).json({message: 'Agenda is required'});
        }

        const result = new MeetingHistory(req.body);
        await result.save();
        res.status(200).json(result);
    } catch (err) {
        console.error('Failed to create :', err);
        res.status(400).json({ err, error: 'Failed to create' });
    }
   
}

const index = async (req, res) => {
    
}

const view = async (req, res) => {
    try {
        const meeting = await MeetingHistory.findById(req.params.id)
            .populate('attendes')
            .populate('attendesLead')
            .populate('createBy')
            .exec();

        if (!meeting || meeting.deleted) {
            return res.status(404).json({ message: "Meeting not found" });
        }

        res.status(200).json(meeting);
    } catch (error) {
        console.error("View Meeting Error:", error);
        res.status(500).json({ error });
    }
}

const deleteData = async (req, res) => {
  
}

const deleteMany = async (req, res) => {
    
}

module.exports = { add, index, view, deleteData, deleteMany }