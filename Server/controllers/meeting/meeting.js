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
      
        query = req.query;
        query.deleted = false;
        

       //Creator Filter
        if (query.createBy) {
            query.createBy = new mongoose.Types.ObjectId(req.query.createBy);
        }

        //Agenda filter
        if (query.agenda) {
            query.agenda = { $regex: query.agenda, $options: 'i' };
        }

        //Date filter
        if (query.startDate || query.endDate) {
            query.dateTime = {};
            if (query.startDate) {
                query.dateTime.$gte = new Date(query.startDate);
            }
            if (query.endDate) {
                query.dateTime.$lte = new Date(query.endDate);
            }
        }

          let result = await MeetingHistory.aggregate([
            { $match: query },
            // Lookup for Contacts (for attendes)
            {
                $lookup: {
                    from: 'Contacts',
                    localField: 'attendes',
                    foreignField: '_id',
                    as: 'contactAttendees'
                }
            },
            // Lookup for Leads (for attendesLead)
            {
                $lookup: {
                    from: 'Leads',
                    localField: 'attendesLead',
                    foreignField: '_id',
                    as: 'leadAttendees'
                }
            },
            // Lookup for creator (createBy)
            {
                $lookup: {
                    from: 'User',
                    localField: 'createBy',
                    foreignField: '_id',
                    as: 'creator'
                }
            },
            // Unwind the arrays (preserving null/empty arrays)
            { $unwind: { path: '$creator', preserveNullAndEmptyArrays: true } },
            // Add fields for formatted names
            {
                $addFields: {
                    // Format contact attendees names
                    formattedContactAttendees: {
                        $map: {
                            input: '$contactAttendees',
                            as: 'contact',
                            in: {
                                $concat: [
                                    { $ifNull: ['$$contact.title', ''] },
                                    ' ',
                                    { $ifNull: ['$$contact.firstName', ''] },
                                    ' ',
                                    { $ifNull: ['$$contact.lastName', ''] }
                                ]
                            }
                        }
                    },
                    // Format lead attendees names
                    formattedLeadAttendees: {
                        $map: {
                            input: '$leadAttendees',
                            as: 'lead',
                            in: '$$lead.leadName'
                        }
                    },
                    // Combine all attendees based on related field
                    allAttendees: {
                        $cond: {
                            if: { $eq: ['$related', 'Contact'] },
                            then: '$formattedContactAttendees',
                            else: {
                                $cond: {
                                    if: { $eq: ['$related', 'Lead'] },
                                    then: '$formattedLeadAttendees',
                                    else: [] // Default case
                                }
                            }
                        }
                    },
                    createdByName: '$creator.username'
                }
            },
            // Project only the fields we want to return
            {
                $project: {
                    contactAttendees: 0,
                    leadAttendees: 0,
                    creator: 0,
                    formattedContactAttendees: 0,
                    formattedLeadAttendees: 0
                }
            }
        ]);  
        if(!result){
            return res.status(404).json("Meeting not found");
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
        let response = await MeetingHistory.findOne({ _id: req.params.id });
        if (!response) return res.status(404).json({ message: "No Data Found." });

        let result = await MeetingHistory.aggregate([
            { $match: { _id: response._id } },
            // Lookup for Contacts (for attendes)
            {
                $lookup: {
                    from: 'Contacts',
                    localField: 'attendes',
                    foreignField: '_id',
                    as: 'contactAttendees'
                }
            },
            // Lookup for Leads (for attendesLead)
            {
                $lookup: {
                    from: 'Leads',
                    localField: 'attendesLead',
                    foreignField: '_id',
                    as: 'leadAttendees'
                }
            },
            // Lookup for creator (createBy)
            {
                $lookup: {
                    from: 'User',
                    localField: 'createBy',
                    foreignField: '_id',
                    as: 'creator'
                }
            },
            // Unwind the arrays (preserving null/empty arrays)
            { $unwind: { path: '$creator', preserveNullAndEmptyArrays: true } },
            // Add fields for formatted names
            {
                $addFields: {
                    // Format contact attendees names
                    formattedContactAttendees: {
                        $map: {
                            input: '$contactAttendees',
                            as: 'contact',
                            in: {
                                $concat: [
                                    { $ifNull: ['$$contact.title', ''] },
                                    ' ',
                                    { $ifNull: ['$$contact.firstName', ''] },
                                    ' ',
                                    { $ifNull: ['$$contact.lastName', ''] }
                                ]
                            }
                        }
                    },
                    // Format lead attendees names
                    formattedLeadAttendees: {
                        $map: {
                            input: '$leadAttendees',
                            as: 'lead',
                            in: '$$lead.leadName'
                        }
                    },
                    // Combine all attendees based on related field
                    allAttendees: {
                        $cond: {
                            if: { $eq: ['$related', 'Contact'] },
                            then: '$formattedContactAttendees',
                            else: {
                                $cond: {
                                    if: { $eq: ['$related', 'Lead'] },
                                    then: '$formattedLeadAttendees',
                                    else: [] // Default case
                                }
                            }
                        }
                    },
                    createdByName: '$creator.username'
                }
            },
            // Project only the fields we want to return
            {
                $project: {
                    contactAttendees: 0,
                    leadAttendees: 0,
                    creator: 0,
                    formattedContactAttendees: 0,
                    formattedLeadAttendees: 0
                }
            }
        ]);

        res.status(200).json(result[0]);

    } catch (err) {
         res.status(500).json({ 
            error: "Failed to fetch meetings",
            details: error.message 
        });
    }
};

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