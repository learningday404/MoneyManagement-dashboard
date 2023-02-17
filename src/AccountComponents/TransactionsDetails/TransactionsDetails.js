import classes from './TransactionsDetails.module.css'
import NewFormModal from '../../Forms/ModalForm/NewFormModal';
import { Fragment, useState, useEffect } from 'react';
import NewForm from '../../Forms/AddNewForm/NewForm';
import PiechartData from '../../UI/PieChartData';

const AccountDetails = (props) => {
    const [ModalOpen, setModalOpen] = useState(false);
    const [formList, setFormList] = useState([]);
    const [totalAmountSpent, setTotalAmountSpent] = useState(0);


    const OpenModal = () => {
        setModalOpen(true);
    }
    const CloseModal = () => {
        setModalOpen(false);
    }
    async function addDataHandler (data) {
        const response = await fetch('https://money-management-5452c-default-rtdb.asia-southeast1.firebasedatabase.app/transactions.json', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async function getDataHandler () {
        const response = await fetch('https://money-management-5452c-default-rtdb.asia-southeast1.firebasedatabase.app/transactions.json')
        const myData = await response.json();
        const transactionsList = [];
        for (const key in myData){
            transactionsList.push({
                id: key,
                radioData: myData[key].radioData,
                activityName: myData[key].activityName,
                amountSpent: myData[key].amountSpent,
            })
            
        }
        setFormList(transactionsList);
        const result = formList.reduce((total, currentValue) => total = parseInt(total) + parseInt(currentValue.amountSpent),0);
        setTotalAmountSpent(result);
        
    }

    useEffect(() => {
        getDataHandler();
    },[])

    const FormList = formList.map((form) => {
        return (
        <NewForm
            number={formList.indexOf(form) + 1}
            activityName={form.activityName}
            amountSpent={'$' + form.amountSpent}
            radioData={form.radioData}
        />
        )
    })
    console.log(totalAmountSpent)

    return(
        <Fragment>
            <div className={classes.container}>
                <button onClick={OpenModal}>Add new data</button>
                <p>Filter</p>
                <table>
                    <tr className={classes.Header}>
                        <th>{totalAmountSpent}</th>
                        <th>Name</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Edit</th>   
                        <th>Delete</th>
                    </tr>
                    {FormList}
                </table>
                {ModalOpen ? (<NewFormModal CloseModal={CloseModal} submitData={addDataHandler} getData={getDataHandler}/>) : null}
            </div>
        </Fragment>
    );
};

export default AccountDetails;