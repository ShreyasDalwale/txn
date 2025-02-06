import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';

const MasterDetailForm = () => {
    const { control, handleSubmit, setValue, reset } = useForm();
    const [rows, setRows] = useState([
        { id: 1, name: '', email: '', age: '' },
    ]);

    // Handle form submission (just for demonstration)
    const onSubmit = (data) => {
        console.log('Submitted data:', data);
    };

    // Add a new row below the last row
    const addRow = () => {
        setRows([...rows, { id: rows.length + 1, name: '', email: '', age: '' }]);
    };

    // Add a new row above the current index
    const addRowAbove = (index) => {
        const newRows = [...rows];
        newRows.splice(index, 0, { id: newRows.length + 1, name: '', email: '', age: '' });
        setRows(newRows);
    };

    // Duplicate a row (either above or below)
    const duplicateRow = (index) => {
        const rowToDuplicate = rows[index];
        setRows([...rows, { ...rowToDuplicate, id: rows.length + 1 }]);
    };

    // Remove a row
    const removeRow = (index) => {
        if (rows.length > 1) {
            const newRows = rows.filter((_, i) => i !== index);
            setRows(newRows);
        }
    };

    // Handle input change for individual row
    const handleChange = (index, field, value) => {
        const updatedRows = [...rows];
        updatedRows[index][field] = value;
        setRows(updatedRows);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>

            <table border="1" cellPadding="10" className="table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Age</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, index) => (
                        <tr key={index}>
                            <td>{row.id}</td>
                            <td>
                                <Controller
                                    name={`rows[${index}].name`}
                                    control={control}
                                    defaultValue={row.name}
                                    render={({ field }) => (
                                        <input
                                            {...field}
                                            type="text"
                                            onChange={(e) => handleChange(index, 'name', e.target.value)}
                                        />
                                    )}
                                />
                            </td>
                            <td>
                                <Controller
                                    name={`rows[${index}].email`}
                                    control={control}
                                    defaultValue={row.email}
                                    render={({ field }) => (
                                        <input
                                            {...field}
                                            type="email"
                                            onChange={(e) => handleChange(index, 'email', e.target.value)}
                                        />
                                    )}
                                />
                            </td>
                            <td>
                                <Controller
                                    name={`rows[${index}].age`}
                                    control={control}
                                    defaultValue={row.age}
                                    render={({ field }) => (
                                        <input
                                            {...field}
                                            type="number"
                                            onChange={(e) => handleChange(index, 'age', e.target.value)}
                                        />
                                    )}
                                />
                            </td>
                            <td>
                                <button type="button" onClick={() => addRowAbove(index)}>Add Above</button>
                                <button type="button" onClick={() => duplicateRow(index)}>Duplicate</button>
                                <button type="button" onClick={() => removeRow(index)}>Remove</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <button type="button" onClick={addRow}>Add Row Below</button>

            <br />
            <br />

            <button type="submit">Submit</button>

        </form>
    );
};

export default MasterDetailForm;
