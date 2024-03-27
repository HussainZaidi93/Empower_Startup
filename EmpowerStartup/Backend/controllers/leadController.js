const Lead=require('../models/leads.model')
const User=require('../models/user.model')

exports.createLead=async(req,res)=>{
    const lead = new Lead()
    const user=await User.findOne({
        name:'Shakir'
    })

    if(!user){
        return res.status(404).send('User naheen he bhai')
    }
    lead.title='I am the lead'
    lead.user = user._id;
    await lead.save()
    return res.status(200).send(lead);
}

exports.findLead=async(req,res)=>{
    const lead = await Lead.findOne({ title: 'I am the lead' }).
    populate('user')

    return res.status(200).send(lead)

    
}