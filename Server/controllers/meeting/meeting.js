const User = require('../../model/schema/user');
const Contact = require('../../model/schema/contact');
const Lead = require('../../model/schema/lead');
const MeetingHistory = require('../../model/schema/meeting')
const mongoose = require('mongoose');

const add = async (req, res) => {
    try {
        const { agenda, attendes, attendesLead } = req.body;
        if(!agenda){
           return res.status(400).json({error: 'Agenda is required'});
        }

        if (attendes) {
            if (!Array.isArray(attendes)) {
                return res.status(400).json({ error: 'attendes must be an array' });
            }
            for (const attendee of attendes) {
                if (!mongoose.Types.ObjectId.isValid(attendee)) {
                    return res.status(400).json({ error: `Invalid attendee ID: ${attendee}` });
                }
            }
        }
         if (attendesLead) {
            if (!Array.isArray(attendesLead)) {
                return res.status(400).json({ error: 'attendes must be an array' });
            }
            for (const attendLead of attendesLead) {
                if (!mongoose.Types.ObjectId.isValid(attendLead)) {
                    return res.status(400).json({ error: `Invalid attendee ID: ${attendLEad}` });
                }
            }
        }

        const result = new MeetingHistory({...req.body,
            createBy: req.user._id
        });
        await result.save();
        res.status(200).json(result);
    } catch (err) {
        console.error('Failed to create :', err.error);
        res.status(400).json({ err, error: 'Failed to create' });
    }
   
}

const index = async (req, res) => {
    
}

const view = async (req, res) => {
    try {
        const meeting = await MeetingHistory.findById(req.params.id)
            .populate('attendes', 'firstName lastName')
            .populate('attendesLead', 'firstName lastName')
            .populate('createBy', 'firstName lastName') 
            .exec();

        if (!meeting || meeting.deleted) {
            return res.status(404).json({ message: "Meeting not found" });
        }

        res.status(200).json(meeting);
    } catch (error) {
        console.error("View Meeting Error:", error);
        res.status(500).json({ error: error.message });
    }
}

const deleteData = async (req, res) => {
  
}

const deleteMany = async (req, res) => {
    
}

module.exports = { add, index, view, deleteData, deleteMany }