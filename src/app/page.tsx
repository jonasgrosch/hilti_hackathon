"use client";

import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

import { useState } from 'react';
import { Document, Page } from 'react-pdf';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface IRow {
  description: string;
  count: number;
  page: number;
}

interface ILabel {
  text: string;
  count: number;
}

interface IPrediction {
  text: string;
  page: number;
  labels: ILabel[];
}
export default function MyApp() {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [file, setFile] = useState<File | null>(null);
  const [selectedText, setSelectedText] = useState<string>('');
  const [extractedRows, setExtractedRows] = useState<IRow[]>([]);
  const [selectedPage, setSelectedPage] = useState<number>(0);
  const [trainingMode, setTrainingMode] = useState<boolean>(true);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  }

  function onPredict() {
    fetch('http://192.168.1.202:4800/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ filename: file?.name }),
    })
      .then((response) => response.json())
      .then((data: IPrediction[]) => {
        setTrainingMode(false);
        for (const prediction of data) {
          for (const label of prediction.labels) {
            setExtractedRows([...extractedRows, { description: label.text, count: label.count, page: prediction.page }]);
          }
        }
      });
  }

  function onHighlight(page: number) {
    const selection = window.getSelection();

    if (selection) {
      setSelectedText(selection.toString());
      setSelectedPage(page);
    }
  }

  function onAddRow() {
    setExtractedRows([...extractedRows, { description: "", count: 0, page: selectedPage }]);
  }

  function onRemoveRow(index: number) {
    setExtractedRows(extractedRows.filter((_, i) => i !== index));
  }

  function onTextChange(index: number, description: string) {
    setExtractedRows(extractedRows.map((row, i) => (i === index ? { ...row, description } : row)));
  }

  function onCountChange(index: number, count: number) {
    setExtractedRows(extractedRows.map((row, i) => (i === index ? { ...row, count } : row)));
  }

  function onPageChange(index: number, page: number) {
    setExtractedRows(extractedRows.map((row, i) => (i === index ? { ...row, page } : row)));
  }

  function onTrain() {
    const body: IPrediction = {
      text: selectedText,
      page: selectedPage,
      labels: extractedRows.map((row) => ({ text: row.description, count: row.count })),
    };
    fetch('http://192.168.1.202:4800/add_sample', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }).then(() => {
      setExtractedRows([]);
    });
  }

  return (
    <div className="flex">
      <div className="w-1/2 p-8 flex flex-col">
        <input placeholder='Choose another file' type="file" accept="application/pdf" onChange={handleFileChange} />

        {file && (<>

          <Textarea readOnly placeholder="Select text in the document" className="w-full h-48 mb-8" value={selectedText} />
          {extractedRows.map((row, index) => (
            <div key={index} className="flex flex-row mb-1">
              <Combobox readOnly={!trainingMode} onSelect={(value) => onTextChange(index, value)} />
              <Input readOnly={!trainingMode} placeholder='Count' className='w-16 mr-2 ml-2' type="number" value={row.count} onChange={(event) => onCountChange(index, Number(event.target.value))} />
              <Input readOnly placeholder='Page number' className='w-16 mr-2' type="number" value={row.page} onChange={(event) => onPageChange(index, Number(event.target.value))} />
              {trainingMode && <Button className='ml-auto' onClick={() => onRemoveRow(index)}>X</Button>}
            </div>
          ))}

          {trainingMode &&<Button onClick={onAddRow} className="mb-2 w-full">Add row</Button>}
          <br />

          <Button variant="secondary" className="w-full mt-auto" onClick={() => onPredict()}>Predict</Button>
          {trainingMode && <Button onClick={() => onTrain()} className="w-full mt-2">Add to database</Button>}
          {!trainingMode && <Button className="w-full mt-2"onClick={() => setTrainingMode(true)}>Train</Button>}
        </>)}
      </div>
      {file && (<Document file={file} onLoadSuccess={onDocumentLoadSuccess} className="w-1/2 h-screen overflow-scroll">
        {Array.from(new Array(numPages), (_, index) => (
          <Page
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            onMouseUp={() => onHighlight(index + 1)}
          />
        ))}
      </Document>)}

    </div>

  );
}