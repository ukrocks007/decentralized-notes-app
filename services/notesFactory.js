import uuid from 'react-uuid'

const saveNote = async (docstore, params) => {
    try {
        params["_id"] = uuid();
        let out = await docstore.put({ ...params });
        return out;
    } catch (ex) {
        console.log(ex);
        return null;
    }
}

const getAllNotes = async (docstore) => {
    try {
        let out = await docstore.query(ele => ele._id);
        return out;
    } catch (ex) {
        console.log(ex);
        return null;
    }
}

export default {
    saveNote, getAllNotes
};