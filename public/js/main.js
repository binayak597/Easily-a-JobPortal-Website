

const deleteJob = (jobId) => {

    const ans = confirm("Are you sure want to delete this jobpost?");

    if(ans){
        fetch(`/delete-job/${jobId}`, {
            method: 'DELETE'
        })
        .then(res => {
            console.log(res.ok);
            if(res.ok){
                //refresh the page
                location.reload();
            }
        })
        .catch(err => {
            console.log(error);
            res.send(err);
        });
    }else{
        window.alert("Operation has been reverted");
    }
}