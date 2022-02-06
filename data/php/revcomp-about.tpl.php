<p><strong>diff</strong> program output for this 10KB <a href="iofile.php?test=<?=$SelectedTest;?>&amp;file=input">input file</a> (generated with the fasta program N = 1000) with this <a href="iofile.php?test=<?=$SelectedTest;?>&amp;file=output">output file</a> to check your program is correct before contributing.
</p>

<p>We use the FASTA file generated by the <a href="benchmark.php?test=fasta&amp;lang=all&amp;sort=<?=$Sort;?>">fasta benchmark</a> as input for this benchmark. Note: the file may include both lowercase and uppercase codes.</p>

<p>Each program should</p>
<ul>
  <li>read line-by-line a redirected <a href="http://en.wikipedia.org/wiki/Fasta_format">FASTA format</a> file from stdin</li>
  <li>for each sequence:
  <ul>
  <li>write the id, description, and the reverse-complement sequence in <a href="http://en.wikipedia.org/wiki/Fasta_format">FASTA format</a> to stdout</li>
  </ul>
  </li>
</ul>

<p>We use these code complements:</p>
<pre>
code  meaning   complement
A    A                   T
C    C                   G
G    G                   C
T/U  T                   A
M    A or C              K
R    A or G              Y
W    A or T              W
S    C or G              S
Y    C or T              R
K    G or T              M
V    A or C or G         B
H    A or C or T         D
D    A or G or T         H
B    C or G or T         V
N    G or A or T or C    N
</pre>
<br />

<p>
"by knowing the sequence of bases of one strand of DNA we immediately know the sequence of the DNA strand which will bind to it, this strand is called the <em><strong>reverse complement</strong></em>" <br />
<a href="http://www.cse.ucsc.edu/~sugnet/documentation/biology_starter/DNA.html">DNA: Structure and Function</a>
</p>



