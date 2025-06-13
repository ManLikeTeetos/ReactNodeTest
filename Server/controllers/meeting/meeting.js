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
        res.status(500).json({ error: 'Failed to create meetings:',
            details: error.message
        });
    }
   
}

const index = async (req, res) => {
    try {
        // Initialize base query with soft delete filter
        query = req.query;
        query.deleted = false;
        

        // Add filter for createBy if provided in query params
        if (query.createBy) {
            query.createBy = new mongoose.Types.ObjectId(req.query.createBy);
        }

        if (query.agenda) {
            query.agenda = { $regex: query.agenda, $options: 'i' };
        }

        // Add date range filtering if provided
        if (query.startDate || query.endDate) {
            query.dateTime = {};
            if (query.startDate) {
                query.dateTime.$gte = new Date(query.startDate);
            }
            if (query.endDate) {
                query.dateTime.$lte = new Date(query.endDate);
            }
        }

        // Build the query with population
        const result = await MeetingHistory.find(query)
            .populate('attendes', 'firstName lastName email phoneNumber')
            .populate('attendesLead', 'firstName lastName email phoneNumber')
            .populate('createBy', 'firstName lastName email')
            .sort({ dateTime: -1 }) // Newest meetings first
            .exec();

         if(!result){
            return res.status(404).json({message: "Meeting not found"});
         }   

        res.status(200).json(result);
    } catch (error) {
        console.error("List Meetings Error:", error);
        res.status(500).json({ 
            error: "Failed to fetch meetings",
            details: error.message 
        });
    }
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
        res.status(500).json({ 
             error: "Failed to fetch meetings",
            details: error.message });
    }
}

const deleteData = async (req, res) => {
     try {
        const result = await MeetingHistory.findByIdAndUpdate(
            req.params.id,
            { deleted: true },
            { new: true }
        );

        if (!result) {
            return res.status(404).json({ message: "Meeting not found" });
        }

        res.status(200).json({ message: "Meeting deleted successfully" });
    } catch (error) {
        console.error("Delete Meeting Error:", error);
        res.status(500).json({ 
             error: "Failed to delete meetings",
            details: error.message });
    }
  
}

const deleteMany = async (req, res) => {
     try {
        const result = await MeetingHistory.updateMany({ _id: { $in: req.body } }, { $set: { deleted: true } });

        if (result?.matchedCount > 0 && result?.modifiedCount > 0) {
            return res.status(200).json({ message: "Meeetings Removed successfully", result });
        }
        else {
            return res.status(404).json({ success: false, message: "Failed to remove meetings" })
        }

    } catch (err) {
        console.error("Delete Meeting Error:", error);
        res.status(500).json({ 
             error: "Failed to delete meetings",
            details: error.message });
    }
}

module.exports = { add, index, view, deleteData, deleteMany }